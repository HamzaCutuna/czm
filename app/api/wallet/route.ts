import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get wallet data
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (walletError && walletError.code !== 'PGRST116') {
      console.error('Error fetching wallet:', walletError);
      return NextResponse.json(
        { error: 'Failed to fetch wallet' },
        { status: 500 }
      );
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('diamond_ledger')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      wallet: wallet || { diamonds_balance: 0 },
      transactions: transactions || []
    });

  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
