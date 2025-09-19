import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    console.log('Daily challenge finalize API called');
    
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header');
      return NextResponse.json(
        { error: 'Unauthorized - No valid token' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token received, length:', token.length);
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    
    console.log('User authenticated:', user.id, user.email);

    // Ensure user record exists - use admin client to bypass RLS
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { data: userRecord, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create them using admin client (bypasses RLS)
      console.log('Creating user record for daily challenge:', user.id);
      
      const { error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          privacy_setting: 'realname'
        });

      if (createError) {
        console.error('Error creating user record:', createError);
        return NextResponse.json(
          { error: 'Failed to create user record', details: createError.message },
          { status: 500 }
        );
      }
      console.log('User record created successfully');
    } else if (userError) {
      console.error('Unexpected error checking user:', userError);
      return NextResponse.json(
        { error: 'Database error', details: userError.message },
        { status: 500 }
      );
    }

    // Check rate limit
    const rateLimitResult = checkRateLimit(user.id, 'QUIZ_FINALIZE', request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimitResult.resetTime 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.resetTime ? 
              Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString() : '60'
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      correct, 
      selectedYear, 
      correctYear, 
      questionTitle 
    } = body;

    // Validate required fields
    if (typeof correct !== 'boolean' || !selectedYear || !correctYear || !questionTitle) {
      return NextResponse.json(
        { error: 'Invalid daily challenge data' },
        { status: 400 }
      );
    }

    // Check if user already attempted today's daily challenge
    const today = new Date().toISOString().split('T')[0];
    
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return NextResponse.json(
        { error: 'Server configuration error - admin client not available' },
        { status: 500 }
      );
    }
    
    const { data: existingAttempt, error: attemptError } = await supabaseAdmin
      .from('quiz_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('game_type', 'dnevni_izazov')
      .gte('created_at', today)
      .maybeSingle();

    if (attemptError) {
      console.error('Error checking existing attempt:', attemptError);
      return NextResponse.json(
        { error: 'Failed to check existing attempt', details: attemptError.message },
        { status: 500 }
      );
    }

    const alreadyAttempted = !!existingAttempt;

    // Calculate diamonds reward (2 diamonds for correct answer)
    let diamondsEarned = 0;
    if (!alreadyAttempted && correct) {
      diamondsEarned = 2;
    }

    // Debug logging
    console.log('Daily challenge finalization debug:', {
      userId: user.id,
      correct,
      selectedYear,
      correctYear,
      alreadyAttempted,
      diamondsEarned
    });

    // Create quiz session record - use admin client
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('quiz_sessions')
      .insert({
        user_id: user.id,
        game_type: 'dnevni_izazov',
        num_questions: 1,
        num_correct: correct ? 1 : 0,
        accuracy_float: correct ? 100 : 0,
        duration_ms: 1, // Use 1 instead of 0 to satisfy check constraint
        rewarded_boolean: diamondsEarned > 0,
        rewarded_diamonds: diamondsEarned,
        session_data: {
          selectedYear,
          correctYear,
          questionTitle,
          correct
        }
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating quiz session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to save quiz session', details: sessionError.message },
        { status: 500 }
      );
    }

    // Award diamonds if earned
    let newBalance = 0;
    if (diamondsEarned > 0) {
      // Get current wallet
      const { data: wallet, error: walletError } = await supabaseAdmin
        .from('user_wallets')
        .select('id, diamonds_balance')
        .eq('user_id', user.id)
        .single();

      if (walletError) {
        console.error('Error fetching wallet:', walletError);
        return NextResponse.json(
          { error: 'Failed to fetch wallet', details: walletError.message },
          { status: 500 }
        );
      }

      // Update wallet balance
      const { data: updatedWallet, error: updateError } = await supabaseAdmin
        .from('user_wallets')
        .update({ 
          diamonds_balance: wallet.diamonds_balance + diamondsEarned,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id)
        .select('diamonds_balance')
        .single();

      if (updateError) {
        console.error('Error updating wallet:', updateError);
        return NextResponse.json(
          { error: 'Failed to update wallet', details: updateError.message },
          { status: 500 }
        );
      }

      // Create ledger entry
      const { error: ledgerError } = await supabaseAdmin
        .from('diamond_ledger')
        .insert({
          user_id: user.id,
          wallet_id: wallet.id,
          amount: diamondsEarned,
          direction: 'earn',
          source: 'dnevni_izazov',
          metadata: { 
            session_id: session.id, 
            selectedYear, 
            correctYear, 
            questionTitle 
          }
        });

      if (ledgerError) {
        console.error('Error creating ledger entry:', ledgerError);
        // Don't fail the request, just log the error
        console.warn('Ledger entry failed but wallet was updated');
      }

      newBalance = updatedWallet.diamonds_balance;
    } else {
      // Get current balance even if no diamonds earned - use admin client
      const { data: wallet } = await supabaseAdmin
        .from('user_wallets')
        .select('diamonds_balance')
        .eq('user_id', user.id)
        .single();
      
      newBalance = wallet?.diamonds_balance || 0;
    }

    // Return success response
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      correct,
      diamondsEarned,
      newBalance,
      alreadyAttempted,
      summary: {
        selectedYear,
        correctYear,
        correct,
        diamondsEarned
      }
    });

  } catch (error) {
    console.error('Error in daily challenge finalization:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: typeof error
      },
      { status: 500 }
    );
  }
}
