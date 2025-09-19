import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      success: true,
      alreadyAttempted,
      userId: user.id,
      today
    });

  } catch (error) {
    console.error('Error in daily challenge check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
