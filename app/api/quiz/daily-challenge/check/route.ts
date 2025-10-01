import { NextRequest, NextResponse } from 'next/server';
import { supabase, checkDailyChallengeClaimed } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check for Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to check daily challenge status' },
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

    // Check if user already claimed today's daily challenge
    const { data: claimData, error: claimError } = await checkDailyChallengeClaimed();

    if (claimError) {
      console.error('Error checking daily challenge claim:', claimError);
      return NextResponse.json(
        { error: 'Failed to check daily challenge status', details: claimError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      alreadyClaimed: claimData?.claimed || false,
      userId: user.id,
      today: new Date().toISOString().split('T')[0]
    });

  } catch (error) {
    console.error('Error in daily challenge check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
