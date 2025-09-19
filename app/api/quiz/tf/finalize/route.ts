import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { calculateDiamondsReward, DEFAULT_REWARDS_CONFIG } from '@/lib/rewards-config';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

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

            console.log('User record check:', {
              userId: user.id,
              userEmail: user.email,
              hasRecord: !!userRecord,
              error: userError?.code
            });

            if (userError && userError.code === 'PGRST116') {
              // User doesn't exist, create them using admin client (bypasses RLS)
              console.log('Creating user record for quiz finalization:', user.id);
              
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
                console.error('Create error details:', {
                  code: createError.code,
                  message: createError.message,
                  details: createError.details,
                  hint: createError.hint
                });
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
            } else {
              console.log('User record already exists');
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
      sessionId, 
      totalQuestions, 
      correctAnswers, 
      durationMs = 0,
      sessionData = {} 
    } = body;

    // Validate required fields
    if (!totalQuestions || !correctAnswers || correctAnswers < 0 || correctAnswers > totalQuestions) {
      return NextResponse.json(
        { error: 'Invalid quiz data' },
        { status: 400 }
      );
    }

    // Calculate accuracy
    const accuracy = (correctAnswers / totalQuestions) * 100;

    // Check if user already received reward today - use admin client
    const { data: existingReward, error: rewardCheckError } = await supabaseAdmin
      .from('quiz_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('game_type', 'tacno_netacno')
      .eq('rewarded_boolean', true)
      .gte('created_at', new Date().toISOString().split('T')[0])
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid errors

    if (rewardCheckError) {
      console.error('Error checking existing reward:', rewardCheckError);
      return NextResponse.json(
        { error: 'Failed to check existing rewards', details: rewardCheckError.message },
        { status: 500 }
      );
    }

    const alreadyRewardedToday = !!existingReward;
    console.log('Daily reward check:', {
      userId: user.id,
      existingReward,
      alreadyRewardedToday,
      dailyLimitEnabled: DEFAULT_REWARDS_CONFIG.ONE_REWARDED_GAME_PER_DAY
    });

    // Calculate diamonds reward
    let diamondsEarned = 0;
    if (!alreadyRewardedToday && totalQuestions >= DEFAULT_REWARDS_CONFIG.MIN_QUESTIONS_FOR_REWARD) {
      diamondsEarned = calculateDiamondsReward(totalQuestions, correctAnswers);
    }

    // Debug logging
    console.log('Quiz finalization debug:', {
      userId: user.id,
      totalQuestions,
      correctAnswers,
      accuracy,
      alreadyRewardedToday,
      diamondsEarned,
      minQuestionsRequired: DEFAULT_REWARDS_CONFIG.MIN_QUESTIONS_FOR_REWARD
    });

    // Create quiz session record - use admin client
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('quiz_sessions')
      .insert({
        user_id: user.id,
        game_type: 'tacno_netacno',
        num_questions: totalQuestions,
        num_correct: correctAnswers,
        accuracy_float: accuracy,
        duration_ms: durationMs,
        rewarded_boolean: diamondsEarned > 0,
        rewarded_diamonds: diamondsEarned,
        session_data: sessionData
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating quiz session:', sessionError);
      console.error('Session error details:', {
        code: sessionError.code,
        message: sessionError.message,
        details: sessionError.details,
        hint: sessionError.hint
      });
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
          source: 'tacno_netacno',
          metadata: { session_id: session.id, ...sessionData }
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
      accuracy: Math.round(accuracy * 100) / 100,
      diamondsEarned,
      newBalance,
      rewardedToday: alreadyRewardedToday,
      summary: {
        totalQuestions,
        correctAnswers,
        accuracy: Math.round(accuracy * 100) / 100,
        durationMs,
        diamondsEarned
      }
    });

  } catch (error) {
    console.error('Error in quiz finalization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
