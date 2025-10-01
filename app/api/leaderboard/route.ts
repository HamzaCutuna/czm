import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEFAULT_REWARDS_CONFIG } from '@/lib/rewards-config';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Check for Authorization header (optional for leaderboard)
    const authHeader = request.headers.get('Authorization');
    let userId = 'anonymous';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || 'anonymous';
    }
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(userId, 'LEADERBOARD', request);
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // Changed from 'scope' to 'period'
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || DEFAULT_REWARDS_CONFIG.LEADERBOARD_PAGE_SIZE.toString());

    // Validate period
    if (!['7', '30', 'all'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be 7, 30, or all' },
        { status: 400 }
      );
    }

    // Validate pagination
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Get leaderboard data using the database function
    const { data: leaderboardResult, error: leaderboardError } = await supabase.rpc('get_leaderboard', {
      p_period: period,
      p_page: page,
      p_page_size: pageSize
    });

    if (leaderboardError) {
      console.error('Error fetching leaderboard:', leaderboardError);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ...leaderboardResult
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
