import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEFAULT_REWARDS_CONFIG } from '@/lib/rewards-config';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Get current user for rate limiting (optional for leaderboard)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
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
    const scope = searchParams.get('scope') || 'daily';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || DEFAULT_REWARDS_CONFIG.LEADERBOARD_PAGE_SIZE.toString());

    // Validate scope
    if (!['daily', 'weekly', 'monthly', 'all'].includes(scope)) {
      return NextResponse.json(
        { error: 'Invalid scope. Must be daily, weekly, monthly, or all' },
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
      p_scope: scope,
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
