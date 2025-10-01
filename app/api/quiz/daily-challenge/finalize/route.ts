import { NextRequest, NextResponse } from 'next/server';
import { supabase, claimDailyChallenge } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    console.log('Daily challenge finalize API called');

    // Check for Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header');
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to claim daily challenge' },
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

    console.log('User authenticated:', user.id, user.email);

    // Check rate limit
    const rateLimitResult = checkRateLimit(user.id, 'DAILY_CHALLENGE_CLAIM', request);
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

    console.log('Daily challenge submission:', {
      userId: user.id,
      correct,
      selectedYear,
      correctYear,
      questionTitle
    });

    // Call the database function to claim the daily challenge
    const { data: result, error } = await claimDailyChallenge(correct ? correctYear : selectedYear);

    if (error) {
      console.error('Database function error:', error);

      // Handle the "Already claimed today" case specifically
      if (error.message === 'Already claimed today') {
        return NextResponse.json(
          {
            error: 'Already claimed today',
            message: 'Već ste pokušali današnji izazov. Pokušajte ponovo sutra.',
            alreadyClaimed: true,
            earned: 0
          },
          { status: 200 } // Return 200 instead of error status for better UX
        );
      }

      return NextResponse.json(
        { error: error.message || 'Failed to claim daily challenge' },
        { status: 500 }
      );
    }

    console.log('Daily challenge claimed successfully:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in daily challenge finalization:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
