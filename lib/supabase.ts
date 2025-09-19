import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Debug environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Service role client for server-side operations (bypasses RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Global error handler for auth errors
export const handleAuthError = (error: any) => {
  if (error?.message?.includes('refresh_token_not_found') || 
      error?.message?.includes('Invalid Refresh Token')) {
    console.warn('Refresh token invalid, clearing session');
    supabase.auth.signOut();
    return true; // Indicates session was cleared
  }
  return false;
};

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  console.log('Attempting sign in with:', { email, url: supabaseUrl });
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Sign in error:', error);
  } else {
    console.log('Sign in success:', data);
  }
  
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  console.log('Attempting sign up with:', { email, url: supabaseUrl });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    console.error('Sign up error:', error);
  } else {
    console.log('Sign up success:', data);
  }
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Wallet RPC functions
export const walletGrant = async (amount: number, reason: string, metadata?: any) => {
  const { data, error } = await supabase.rpc('wallet_grant', {
    p_amount: amount,
    p_reason: reason,
    p_metadata: metadata || {},
  });
  
  if (error && handleAuthError(error)) {
    return { data: null, error: { message: 'Session expired. Please sign in again.' } };
  }
  
  return { data, error };
};

export const walletSpend = async (amount: number, reason: string, metadata?: any) => {
  const { data, error } = await supabase.rpc('wallet_spend', {
    p_amount: amount,
    p_reason: reason,
    p_metadata: metadata || {},
  });
  
  if (error && handleAuthError(error)) {
    return { data: null, error: { message: 'Session expired. Please sign in again.' } };
  }
  
  return { data, error };
};

export const completeDailyChallenge = async (isCorrect: boolean) => {
  const { data, error } = await supabase.rpc('complete_daily_challenge', {
    p_is_correct: isCorrect,
  });
  
  if (error && handleAuthError(error)) {
    return { data: null, error: { message: 'Session expired. Please sign in again.' } };
  }
  
  return { data, error };
};

export const finishTrueFalseRound = async (
  totalQuestions: number, 
  correctAnswers: number, 
  durationMs: number = 0,
  sessionData: any = {}
) => {
  const { data, error } = await supabase.rpc('finish_true_false_round', {
    p_total_questions: totalQuestions,
    p_correct_answers: correctAnswers,
    p_duration_ms: durationMs,
    p_session_data: sessionData,
  });
  
  if (error && handleAuthError(error)) {
    return { data: null, error: { message: 'Session expired. Please sign in again.' } };
  }
  
  return { data, error };
};

// Data fetching functions
export const getWallet = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }
  
  const { data, error } = await supabase
    .from('user_wallets')
    .select('*')
    .eq('user_id', user.id)
    .single();
  return { data, error };
};

export const getTransactions = async (limit = 20, offset = 0) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }
  
  const { data, error } = await supabase
    .from('diamond_ledger')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return { data, error };
};

export const getDailyChallengeStatus = async () => {
  const { data, error } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('challenge_date', new Date().toISOString().split('T')[0])
    .single();
  return { data, error };
};

export const getTrueFalseRoundStatus = async () => {
  const { data, error } = await supabase
    .from('true_false_rounds')
    .select('*')
    .eq('round_date', new Date().toISOString().split('T')[0])
    .single();
  return { data, error };
};

// New API functions for the rewards system
export const spendDiamonds = async (helpType: string, metadata: any = {}) => {
  const response = await fetch('/api/wallet/spend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ helpType, metadata }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    return { data: null, error };
  }
  
  const data = await response.json();
  return { data, error: null };
};

export const getLeaderboard = async (scope: string = 'daily', page: number = 1, pageSize: number = 20) => {
  const response = await fetch(`/api/leaderboard?scope=${scope}&page=${page}&pageSize=${pageSize}`);
  
  if (!response.ok) {
    const error = await response.json();
    return { data: null, error };
  }
  
  const data = await response.json();
  return { data, error: null };
};
