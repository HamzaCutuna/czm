import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Debug environment variables
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

type Metadata = Record<string, unknown>;

const getErrorMessage = (error: unknown): string | null => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === 'string' ? message : null;
  }
  return null;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development'
  },
  global: {
    headers: {
      'x-client-info': 'tvkalendar-web'
    }
  },
  realtime: {
    logLevel: 'error'
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
export const handleAuthError = (error: unknown) => {
  const message = getErrorMessage(error);
  if (message?.includes('refresh_token_not_found') || 
      message?.includes('Invalid Refresh Token')) {
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

// Updated Wallet RPC functions using new naming
export const walletIncrement = async (amount: number, reason: string, metadata?: Metadata) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase.rpc('wallet_increment', {
    p_user: user.id,
    p_amount: amount,
    p_reason: reason,
    p_metadata: metadata || {},
  });

  if (error && handleAuthError(error)) {
    return { data: null, error: { message: 'Session expired. Please sign in again.' } };
  }

  return { data, error };
};

export const walletSpend = async (amount: number, reason: string, metadata?: Metadata) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase.rpc('wallet_spend', {
    p_user: user.id,
    p_amount: amount,
    p_reason: reason,
    p_metadata: metadata || {},
  });

  if (error) {
    if (handleAuthError(error)) {
      return { data: null, error: { message: 'Session expired. Please sign in again.' } };
    }
    return { data: null, error };
  }

  // The database function returns a boolean, not an object with data property
  return { data: data, error: null };
};

export const finalizeQuiz = async (
  mode: string,
  questionCount: number,
  correctCount: number,
  durationMs: number = 0
) => {
  const { data, error } = await supabase.rpc('finalize_quiz', {
    p_mode: mode,
    p_question_count: questionCount,
    p_correct_count: correctCount,
    p_duration_ms: durationMs,
  });

  if (error && handleAuthError(error)) {
    return { data: null, error: { message: 'Session expired. Please sign in again.' } };
  }

  return { data, error };
};

export const claimDailyChallenge = async (answerId: string) => {
  const { data, error } = await supabase.rpc('claim_daily_challenge', {
    p_answer_id: answerId,
  });

  if (error && handleAuthError(error)) {
    return { data: null, error: { message: 'Session expired. Please sign in again.' } };
  }

  return { data, error };
};

// Updated data fetching functions using new table names
export const getWallet = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('wallet_balances')
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
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return { data, error };
};

export const getDailyChallenge = async () => {
  // For now, return a placeholder - this would be implemented with actual daily challenges
  const today = new Date().toISOString().split('T')[0];
  return {
    data: {
      id: 'daily-challenge-' + today,
      challengeDate: today,
      question: 'What year was the Berlin Wall built?',
      options: [
        { id: '1', text: '1961' },
        { id: '2', text: '1962' },
        { id: '3', text: '1963' },
        { id: '4', text: '1964' }
      ],
      correctAnswerId: '1',
      alreadyClaimed: false
    },
    error: null
  };
};

export const checkDailyChallengeClaimed = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_challenge_claims')
    .select('*')
    .eq('user_id', user.id)
    .eq('challenge_date', today)
    .single();

  // If no record exists, user hasn't claimed yet
  if (error && error.code === 'PGRST116') {
    return { data: { claimed: false }, error: null };
  }

  return { data: { claimed: !!data }, error };
};

export const getLeaderboard = async (period: string = '30', page: number = 1, pageSize: number = 20) => {
  const { data, error } = await supabase.rpc('get_leaderboard', {
    p_period: period,
    p_page: page,
    p_page_size: pageSize
  });

  if (error && handleAuthError(error)) {
    return { data: null, error: { message: 'Session expired. Please sign in again.' } };
  }

  return { data, error };
};

// New API functions for the rewards system
export const spendDiamonds = async (helpType: string, metadata: Metadata = {}) => {
  // Get the current session token for authentication
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {
      data: null,
      error: { message: 'User not authenticated. Please sign in to use power-ups.' }
    };
  }

  const response = await fetch('/api/wallet/spend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
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

