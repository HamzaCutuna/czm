import { NextRequest, NextResponse } from 'next/server';
import { supabase, finalizeQuiz } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Get current user (will be null for guests)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError && authError.message !== 'Auth session missing!') {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }

    // Check rate limit (use user ID or anonymous ID)
    const userId = user?.id || 'anonymous';
    const rateLimitResult = checkRateLimit(userId, 'QUIZ_FINALIZE', request);
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
      mode,
      questionCount,
      correctCount,
      durationMs = 0
    } = body;

    // Validate required fields
    if (!mode || !questionCount || correctCount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: mode, questionCount, correctCount' },
        { status: 400 }
      );
    }

    if (questionCount <= 0 || correctCount < 0 || correctCount > questionCount) {
      return NextResponse.json(
        { error: 'Invalid quiz data' },
        { status: 400 }
      );
    }

    console.log('Finalizing quiz:', {
      mode,
      questionCount,
      correctCount,
      durationMs,
      userId: user?.id || 'guest'
    });

    // Call the database function
    const { data: result, error } = await finalizeQuiz(
      mode,
      questionCount,
      correctCount,
      durationMs
    );

    if (error) {
      console.error('Database function error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to finalize quiz' },
        { status: 500 }
      );
    }

    console.log('Quiz finalized successfully:', result);

    // Transform database response to match frontend expectations
    const transformedResult = {
      ...result,
      earnedThisGame: result.earned_this_game,
      alreadyPlayedToday: result.already_played_today,
      requiresLoginForRewards: result.requires_login_for_rewards,
      // Remove the snake_case versions to avoid confusion
      earned_this_game: undefined,
      already_played_today: undefined,
      requires_login_for_rewards: undefined,
    };

    return NextResponse.json(transformedResult);

  } catch (error) {
    console.error('Error in quiz finalization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

