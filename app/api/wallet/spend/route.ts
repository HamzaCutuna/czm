import { NextRequest, NextResponse } from 'next/server';
import { supabase, walletSpend } from '@/lib/supabase';
import { DEFAULT_REWARDS_CONFIG } from '@/lib/rewards-config';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Check for Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to use power-ups' },
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

    // Check rate limit
    const rateLimitResult = checkRateLimit(user.id, 'WALLET_SPEND');
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
    const { helpType, metadata = {} } = body;

    // Validate help type and get cost
    let cost = 0;
    let reason = '';

    switch (helpType) {
      case 'fiftyFifty':
        cost = DEFAULT_REWARDS_CONFIG.HELP_COSTS.fiftyFifty;
        reason = 'powerup_5050';
        break;
      case 'skip':
        cost = DEFAULT_REWARDS_CONFIG.HELP_COSTS.skip;
        reason = 'powerup_skip';
        break;
      case 'removeOne':
        cost = DEFAULT_REWARDS_CONFIG.HELP_COSTS.removeOne;
        reason = 'powerup_remove';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid help type' },
          { status: 400 }
        );
    }

    // Spend diamonds using the new RPC function
    const { data: spendResult, error: spendError } = await walletSpend(cost, reason, {
      help_type: helpType,
      ...metadata
    });

    if (spendError) {
      console.error('Error spending diamonds:', spendError);

      if (spendError.message?.includes('Insufficient diamonds') || spendError.message?.includes('insufficient')) {
        return NextResponse.json(
          { ok: false, error: 'INSUFFICIENT_FUNDS' },
          { status: 402 } // Payment Required
        );
      }

      return NextResponse.json(
        { ok: false, error: 'Failed to spend diamonds' },
        { status: 500 }
      );
    }

    // Check if the spend was successful (spendResult is a boolean)
    if (!spendResult) {
      return NextResponse.json(
        { ok: false, error: 'INSUFFICIENT_FUNDS' },
        { status: 402 } // Payment Required
      );
    }

    // Refresh wallet data to get updated balance
    const { data: walletData } = await supabase
      .from('wallet_balances')
      .select('diamonds')
      .eq('user_id', user.id)
      .single();

    const newBalance = walletData?.diamonds || 0;

    return NextResponse.json({
      ok: true,
      totalBalance: newBalance,
      helpType,
      cost,
      success: true
    });

  } catch (error) {
    console.error('Error spending diamonds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
