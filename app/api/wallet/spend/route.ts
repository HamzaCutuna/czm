import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEFAULT_REWARDS_CONFIG } from '@/lib/rewards-config';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimitResult = checkRateLimit(user.id, 'WALLET_SPEND', request);
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
        reason = 'help';
        break;
      case 'skip':
        cost = DEFAULT_REWARDS_CONFIG.HELP_COSTS.skip;
        reason = 'help';
        break;
      case 'removeOne':
        cost = DEFAULT_REWARDS_CONFIG.HELP_COSTS.removeOne;
        reason = 'help';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid help type' },
          { status: 400 }
        );
    }

    // Spend diamonds
    const { data: spendResult, error: spendError } = await supabase.rpc('wallet_spend', {
      p_amount: cost,
      p_reason: reason,
      p_metadata: { help_type: helpType, ...metadata }
    });

    if (spendError) {
      if (spendError.message?.includes('Insufficient diamonds')) {
        return NextResponse.json(
          { error: 'Insufficient diamonds' },
          { status: 400 }
        );
      }
      
      console.error('Error spending diamonds:', spendError);
      return NextResponse.json(
        { error: 'Failed to spend diamonds' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      newBalance: spendResult.new_balance,
      helpType,
      cost,
      ledgerId: spendResult.ledger_id
    });

  } catch (error) {
    console.error('Error spending diamonds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
