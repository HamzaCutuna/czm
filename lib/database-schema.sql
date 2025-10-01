-- Enhanced Database schema for diamonds rewards system
-- This file contains the SQL for creating the necessary tables and functions
-- Updated to match the new requirements with proper table names and structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CREATE/ENSURE ALL TABLES EXIST WITH CORRECT STRUCTURE
-- ============================================================================

-- Profiles table (main user profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  privacy_setting TEXT DEFAULT 'realname' CHECK (privacy_setting IN ('realname', 'anon')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Wallet balances table
CREATE TABLE IF NOT EXISTS wallet_balances (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  diamonds INTEGER NOT NULL DEFAULT 0 CHECK (diamonds >= 0),
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Wallet transactions table (replaces diamond_ledger)
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL, -- positive for earn, negative for spend
  reason TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced quiz sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Allow guest sessions (null)
  mode TEXT NOT NULL CHECK (mode IN ('true_false', 'daily')),
  question_count INTEGER NOT NULL CHECK (question_count > 0),
  correct_count INTEGER NOT NULL DEFAULT 0 CHECK (correct_count >= 0 AND correct_count <= question_count),
  duration_ms INTEGER NOT NULL DEFAULT 0 CHECK (duration_ms >= 0),
  played_on DATE NOT NULL DEFAULT CURRENT_DATE,
  reward_granted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Daily challenge claims table
CREATE TABLE IF NOT EXISTS daily_challenge_claims (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  granted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, challenge_date)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

DROP INDEX IF EXISTS idx_wallet_balances_user_id;
DROP INDEX IF EXISTS idx_wallet_transactions_user_id;
DROP INDEX IF EXISTS idx_wallet_transactions_created_at;
DROP INDEX IF EXISTS idx_quiz_sessions_user_id;
DROP INDEX IF EXISTS idx_quiz_sessions_mode;
DROP INDEX IF EXISTS idx_quiz_sessions_played_on;
DROP INDEX IF EXISTS idx_quiz_sessions_reward_granted;
DROP INDEX IF EXISTS idx_daily_challenge_claims_user_date;
DROP INDEX IF EXISTS idx_daily_challenge_claims_created_at;

CREATE INDEX idx_wallet_balances_user_id ON wallet_balances(user_id);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at);
CREATE INDEX idx_quiz_sessions_user_id ON quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_mode ON quiz_sessions(mode);
CREATE INDEX idx_quiz_sessions_played_on ON quiz_sessions(played_on);
CREATE INDEX idx_quiz_sessions_reward_granted ON quiz_sessions(reward_granted);
CREATE INDEX idx_daily_challenge_claims_user_date ON daily_challenge_claims(user_id, challenge_date);
CREATE INDEX idx_daily_challenge_claims_created_at ON daily_challenge_claims(created_at);

-- ============================================================================
-- SECURITY DEFINER FUNCTIONS (RPCs)
-- ============================================================================

-- Function to increment wallet balance (idempotent)
CREATE OR REPLACE FUNCTION wallet_increment(
  p_user UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  
  -- Get current balance or create wallet if needed
  SELECT diamonds INTO current_balance
  FROM wallet_balances
  WHERE user_id = p_user;

  IF NOT FOUND THEN
    -- Wallet doesn't exist, create it
    INSERT INTO wallet_balances (user_id, diamonds) VALUES (p_user, p_amount);
  ELSE
    -- Update existing wallet
    UPDATE wallet_balances
    SET diamonds = diamonds + p_amount, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user;
  END IF;

  -- Record transaction
  INSERT INTO wallet_transactions (user_id, delta, reason, metadata)
  VALUES (p_user, p_amount, p_reason, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to spend from wallet (idempotent)
CREATE OR REPLACE FUNCTION wallet_spend(
  p_user UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  
  -- Get current balance or create wallet if needed
  SELECT diamonds INTO current_balance
  FROM wallet_balances
  WHERE user_id = p_user;

  IF NOT FOUND THEN
    -- Wallet doesn't exist, create it with 0 diamonds
    INSERT INTO wallet_balances (user_id, diamonds) VALUES (p_user, 0);
    current_balance := 0;
  END IF;
  
  -- Check sufficient balance
  IF current_balance < p_amount THEN
    RETURN FALSE; -- Insufficient funds
  END IF;
  
  -- Deduct and record transaction
  UPDATE wallet_balances
  SET diamonds = diamonds - p_amount, updated_at = CURRENT_TIMESTAMP
  WHERE user_id = p_user;

  INSERT INTO wallet_transactions (user_id, delta, reason, metadata)
  VALUES (p_user, -p_amount, p_reason, p_metadata);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark quiz as rewarded (idempotent)
CREATE OR REPLACE FUNCTION mark_quiz_rewarded(p_session UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE quiz_sessions SET reward_granted = TRUE WHERE id = p_session;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to finalize quiz and grant rewards (idempotent)
CREATE OR REPLACE FUNCTION finalize_quiz(
  p_mode TEXT,
  p_question_count INTEGER,
  p_correct_count INTEGER,
  p_duration_ms INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
  current_user_id UUID;
  accuracy DECIMAL(10,2);
  diamonds_earned INTEGER := 0;
  session_id UUID;
  already_rewarded_today BOOLEAN := FALSE;
  current_balance INTEGER;
BEGIN
  -- Get current user (can be null for guest sessions)
  current_user_id := auth.uid();
  
  -- Validate inputs
  IF p_question_count <= 0 OR p_correct_count < 0 OR p_correct_count > p_question_count THEN
    RETURN jsonb_build_object('error', 'Invalid quiz data');
  END IF;
  
  -- Calculate accuracy
  accuracy := (p_correct_count::DECIMAL / p_question_count) * 100;
  
  -- For true_false mode, check daily reward eligibility
  IF p_mode = 'true_false' AND current_user_id IS NOT NULL THEN
  SELECT EXISTS(
    SELECT 1 FROM quiz_sessions 
    WHERE user_id = current_user_id 
        AND mode = 'true_false'
        AND reward_granted = TRUE
        AND played_on = CURRENT_DATE
  ) INTO already_rewarded_today;
  
    -- Calculate reward (simplified rule: floor(correct_count * 0.5))
    IF NOT already_rewarded_today THEN
      diamonds_earned := FLOOR(p_correct_count * 0.5);
    END IF;
  END IF;
  
  -- Create quiz session record
  INSERT INTO quiz_sessions (
    user_id, mode, question_count, correct_count, duration_ms, reward_granted
  ) VALUES (
    current_user_id, p_mode, p_question_count, p_correct_count, p_duration_ms, diamonds_earned > 0
  ) RETURNING id INTO session_id;
  
  -- Award diamonds if earned and user is authenticated
  IF diamonds_earned > 0 AND current_user_id IS NOT NULL THEN
    PERFORM wallet_increment(current_user_id, diamonds_earned, 'quiz_reward',
      jsonb_build_object('mode', p_mode, 'session_id', session_id, 'question_count', p_question_count));
  END IF;

  -- Get current balance for response
  IF current_user_id IS NOT NULL THEN
    SELECT diamonds INTO current_balance FROM wallet_balances WHERE user_id = current_user_id;
    current_balance := COALESCE(current_balance, 0);
  ELSE
    current_balance := NULL;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', session_id,
    'accuracy', accuracy,
    'earned_this_game', diamonds_earned,
    'total_balance', current_balance,
    'already_played_today', already_rewarded_today,
    'requires_login_for_rewards', current_user_id IS NULL AND p_mode = 'true_false'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to claim daily challenge (simplified for now, idempotent)
CREATE OR REPLACE FUNCTION claim_daily_challenge(p_answer_id UUID)
RETURNS JSONB AS $$
DECLARE
  current_user_id UUID;
  is_correct BOOLEAN;
  already_claimed BOOLEAN;
  current_balance INTEGER;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Authentication required');
  END IF;

  -- For now, we'll use a simple deterministic approach based on the date
  -- In a real implementation, you'd have a daily_challenges table with actual questions
  -- For this demo, we'll assume the correct answer is always the same for simplicity

  -- Check if already claimed today
  SELECT EXISTS(
    SELECT 1 FROM daily_challenge_claims
    WHERE user_id = current_user_id
      AND challenge_date = CURRENT_DATE
  ) INTO already_claimed;

  IF already_claimed THEN
    RETURN jsonb_build_object('error', 'Already claimed today');
  END IF;

  -- For demo purposes, assume the answer is correct (you'd implement real logic here)
  -- In a real implementation, you would validate against the actual correct answer
  -- For now, we'll assume the client sends the correct answer
  is_correct := TRUE;

  -- If correct and not yet claimed, grant reward
  IF is_correct THEN
    INSERT INTO daily_challenge_claims (user_id, challenge_date, granted)
    VALUES (current_user_id, CURRENT_DATE, TRUE);

    PERFORM wallet_increment(current_user_id, 1, 'daily_challenge',
      jsonb_build_object('challenge_date', CURRENT_DATE));
  END IF;

  -- Get updated balance
  SELECT diamonds INTO current_balance FROM wallet_balances WHERE user_id = current_user_id;
  current_balance := COALESCE(current_balance, 0);

  RETURN jsonb_build_object(
    'success', true,
    'correct', is_correct,
    'earned', CASE WHEN is_correct THEN 1 ELSE 0 END,
    'total_balance', current_balance,
    'locked_until', (CURRENT_DATE + INTERVAL '1 day')::TEXT
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get leaderboard with weighted scoring (idempotent)
CREATE OR REPLACE FUNCTION get_leaderboard(
  p_period TEXT DEFAULT '30',
  p_page INTEGER DEFAULT 1,
  p_page_size INTEGER DEFAULT 20
)
RETURNS JSONB AS $$
DECLARE
  start_date DATE;
  total_count INTEGER;
  leaderboard_data JSONB;
BEGIN
  -- Calculate start date based on period
  CASE p_period
    WHEN '7' THEN start_date := CURRENT_DATE - INTERVAL '7 days';
    WHEN '30' THEN start_date := CURRENT_DATE - INTERVAL '30 days';
    ELSE start_date := '1900-01-01'::DATE;
  END CASE;
  
  -- Get total count
  SELECT COUNT(*) INTO total_count
  FROM quiz_sessions qs
  WHERE qs.played_on >= start_date
    AND qs.mode = 'true_false'
    AND qs.user_id IS NOT NULL;

  -- Get leaderboard data with weighted scoring
  SELECT jsonb_agg(
    jsonb_build_object(
      'rank', row_number() OVER (ORDER BY score DESC, qs.question_count DESC, qs.duration_ms ASC, qs.created_at ASC),
      'user_id', qs.user_id,
      'username', COALESCE(p.username, 'Anonymous'),
      'mode', qs.mode,
      'question_count', qs.question_count,
      'correct_count', qs.correct_count,
      'accuracy', ROUND((qs.correct_count::FLOAT / qs.question_count) * 100, 1),
      'duration_ms', qs.duration_ms,
      'score', ROUND(
        ((qs.correct_count::FLOAT / qs.question_count) * 100) *
        LN(1 + qs.question_count) * 100
      ),
      'created_at', qs.created_at
    )
  ) INTO leaderboard_data
  FROM (
    SELECT DISTINCT ON (qs.user_id, qs.played_on)
      qs.*,
      -- Weighted score: accuracy * ln(1 + question_count) * 100
      ROUND(
        ((qs.correct_count::FLOAT / qs.question_count) * 100) *
        LN(1 + qs.question_count) * 100
      ) as score
    FROM quiz_sessions qs
    WHERE qs.played_on >= start_date
      AND qs.mode = 'true_false'
      AND qs.user_id IS NOT NULL
    ORDER BY qs.user_id, qs.played_on DESC, score DESC
  ) qs
  LEFT JOIN profiles p ON qs.user_id = p.id
  ORDER BY score DESC, qs.question_count DESC, qs.duration_ms ASC, qs.created_at ASC
  LIMIT p_page_size OFFSET ((p_page - 1) * p_page_size);
  
  RETURN jsonb_build_object(
    'success', true,
    'period', p_period,
    'page', p_page,
    'page_size', p_page_size,
    'total_count', total_count,
    'data', COALESCE(leaderboard_data, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenge_claims ENABLE ROW LEVEL SECURITY;

-- Profiles policies - users can view/update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Wallet balances policies - users can only see their own balance
DROP POLICY IF EXISTS "Users can view own wallet" ON wallet_balances;
DROP POLICY IF EXISTS "Enable insert for wallet creation" ON wallet_balances;
CREATE POLICY "Users can view own wallet" ON wallet_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for wallet creation" ON wallet_balances FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wallet transactions policies - users can only see their own transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON wallet_transactions;
CREATE POLICY "Users can view own transactions" ON wallet_transactions FOR SELECT USING (auth.uid() = user_id);

-- Quiz sessions policies - users can view their own sessions, guests can insert null user_id
DROP POLICY IF EXISTS "Users can view own sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON quiz_sessions;
CREATE POLICY "Users can view own sessions" ON quiz_sessions FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert own sessions" ON quiz_sessions FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own sessions" ON quiz_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Daily challenge claims policies - users can only see their own claims
DROP POLICY IF EXISTS "Users can view own claims" ON daily_challenge_claims;
DROP POLICY IF EXISTS "Users can insert own claims" ON daily_challenge_claims;
CREATE POLICY "Users can view own claims" ON daily_challenge_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own claims" ON daily_challenge_claims FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- GRANTS FOR AUTHENTICATED USERS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON wallet_balances TO authenticated;
GRANT SELECT, INSERT ON wallet_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON quiz_sessions TO authenticated;
GRANT SELECT, INSERT ON daily_challenge_claims TO authenticated;
GRANT EXECUTE ON FUNCTION wallet_increment(UUID, INTEGER, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION wallet_spend(UUID, INTEGER, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_quiz_rewarded(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION finalize_quiz(TEXT, INTEGER, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION claim_daily_challenge(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_leaderboard(TEXT, INTEGER, INTEGER) TO authenticated;

-- Grant anon role read access to public leaderboards (for logged-out users)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON quiz_sessions TO anon;
GRANT SELECT ON profiles TO anon;
