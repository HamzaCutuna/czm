import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateDiamondsReward, DEFAULT_REWARDS_CONFIG } from '@/lib/rewards-config';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        error: 'Unauthorized',
        authError: authError?.message,
        user: user
      });
    }

    console.log('Debug: User authenticated:', user.id, user.email);

    // First, check if user exists in users table
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create them
      console.log('Debug: Creating user record for:', user.id);
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          privacy_setting: 'realname'
        })
        .select()
        .single();

      if (createError) {
        console.error('Debug: Error creating user:', createError);
        return NextResponse.json({
          error: 'Failed to create user record',
          details: createError.message
        }, { status: 500 });
      }

      console.log('Debug: User created successfully:', newUser);
    }

    // Get wallet info
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (walletError && walletError.code === 'PGRST116') {
      // Wallet doesn't exist, create it
      console.log('Debug: Creating wallet for user:', user.id);
      const { data: newWallet, error: createWalletError } = await supabase
        .from('user_wallets')
        .insert({
          user_id: user.id,
          diamonds_balance: 0
        })
        .select()
        .single();

      if (createWalletError) {
        console.error('Debug: Error creating wallet:', createWalletError);
        return NextResponse.json({
          error: 'Failed to create wallet',
          details: createWalletError.message
        }, { status: 500 });
      }

      console.log('Debug: Wallet created successfully:', newWallet);
    }

    // Get final wallet data
    const { data: finalWallet, error: finalWalletError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get recent quiz sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('diamond_ledger')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Test reward calculation
    const testReward = calculateDiamondsReward(10, 8); // 10 questions, 8 correct (80%)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      },
      userRecord: userRecord || { error: userError?.message },
      wallet: finalWallet || { error: finalWalletError?.message },
      recentSessions: sessions || { error: sessionsError?.message },
      recentTransactions: transactions || { error: transactionsError?.message },
      testRewardCalculation: {
        questions: 10,
        correct: 8,
        accuracy: 80,
        diamonds: testReward,
        config: DEFAULT_REWARDS_CONFIG
      }
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
