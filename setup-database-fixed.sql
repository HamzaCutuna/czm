-- Fixed setup script that handles existing policies gracefully
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (if not already exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  privacy_setting VARCHAR(20) DEFAULT 'realname' CHECK (privacy_setting IN ('realname', 'anon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User wallets table
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  diamonds_balance INTEGER NOT NULL DEFAULT 0 CHECK (diamonds_balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Diamond ledger for tracking all transactions
CREATE TABLE IF NOT EXISTS diamond_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES user_wallets(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('earn', 'spend')),
  source VARCHAR(50) NOT NULL CHECK (source IN ('tacno_netacno', 'help', 'daily_challenge', 'bonus')),
  quiz_session_id UUID NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz sessions table for tracking game results
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type VARCHAR(20) NOT NULL CHECK (game_type IN ('tacno_netacno', 'kviz', 'daily_challenge')),
  num_questions INTEGER NOT NULL CHECK (num_questions > 0),
  num_correct INTEGER NOT NULL CHECK (num_correct >= 0 AND num_correct <= num_questions),
  accuracy_float DECIMAL(5,2) NOT NULL CHECK (accuracy_float >= 0 AND accuracy_float <= 100),
  duration_ms INTEGER NOT NULL CHECK (duration_ms > 0),
  rewarded_boolean BOOLEAN NOT NULL DEFAULT FALSE,
  rewarded_diamonds INTEGER NOT NULL DEFAULT 0 CHECK (rewarded_diamonds >= 0),
  session_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a regular column for the date (without time)
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS created_date DATE;

-- Create index on the date column
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_date ON quiz_sessions(created_date);

-- Create trigger function to automatically set created_date
CREATE OR REPLACE FUNCTION set_created_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_date := NEW.created_at::DATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically populate created_date
DROP TRIGGER IF EXISTS trigger_set_created_date ON quiz_sessions;
CREATE TRIGGER trigger_set_created_date
  BEFORE INSERT OR UPDATE ON quiz_sessions
  FOR EACH ROW
  EXECUTE FUNCTION set_created_date();

-- Update existing records to have created_date set
UPDATE quiz_sessions SET created_date = created_at::DATE WHERE created_date IS NULL;

-- Unique constraint for one rewarded game per day per user per game type
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_daily_reward 
ON quiz_sessions(user_id, game_type, created_date) 
WHERE rewarded_boolean = TRUE;

-- Function to create or get user wallet
CREATE OR REPLACE FUNCTION get_or_create_wallet(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  wallet_id UUID;
BEGIN
  -- Try to get existing wallet
  SELECT id INTO wallet_id FROM user_wallets WHERE user_id = p_user_id;
  
  -- If no wallet exists, create one
  IF wallet_id IS NULL THEN
    INSERT INTO user_wallets (user_id, diamonds_balance)
    VALUES (p_user_id, 0)
    RETURNING id INTO wallet_id;
  END IF;
  
  RETURN wallet_id;
END;
$$ LANGUAGE plpgsql;

-- Function to grant diamonds
CREATE OR REPLACE FUNCTION wallet_grant(
  p_amount INTEGER,
  p_reason VARCHAR(255),
  p_metadata JSONB DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
  current_user_id UUID;
  wallet_id UUID;
  new_balance INTEGER;
  ledger_id UUID;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'User not authenticated');
  END IF;
  
  -- Validate amount
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('error', 'Amount must be positive');
  END IF;
  
  -- Get or create wallet
  wallet_id := get_or_create_wallet(current_user_id);
  
  -- Update wallet balance
  UPDATE user_wallets 
  SET diamonds_balance = diamonds_balance + p_amount,
      updated_at = NOW()
  WHERE id = wallet_id
  RETURNING diamonds_balance INTO new_balance;
  
  -- Create ledger entry
  INSERT INTO diamond_ledger (user_id, wallet_id, amount, direction, source, metadata)
  VALUES (current_user_id, wallet_id, p_amount, 'earn', p_reason, p_metadata)
  RETURNING id INTO ledger_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'new_balance', new_balance,
    'ledger_id', ledger_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to spend diamonds
CREATE OR REPLACE FUNCTION wallet_spend(
  p_amount INTEGER,
  p_reason VARCHAR(255),
  p_metadata JSONB DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
  current_user_id UUID;
  wallet_id UUID;
  current_balance INTEGER;
  new_balance INTEGER;
  ledger_id UUID;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'User not authenticated');
  END IF;
  
  -- Validate amount
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('error', 'Amount must be positive');
  END IF;
  
  -- Get wallet
  SELECT id, diamonds_balance INTO wallet_id, current_balance
  FROM user_wallets 
  WHERE user_id = current_user_id;
  
  IF wallet_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Wallet not found');
  END IF;
  
  -- Check if user has enough diamonds
  IF current_balance < p_amount THEN
    RETURN jsonb_build_object('error', 'Insufficient diamonds');
  END IF;
  
  -- Update wallet balance
  UPDATE user_wallets 
  SET diamonds_balance = diamonds_balance - p_amount,
      updated_at = NOW()
  WHERE id = wallet_id
  RETURNING diamonds_balance INTO new_balance;
  
  -- Create ledger entry
  INSERT INTO diamond_ledger (user_id, wallet_id, amount, direction, source, metadata)
  VALUES (current_user_id, wallet_id, p_amount, 'spend', p_reason, p_metadata)
  RETURNING id INTO ledger_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'new_balance', new_balance,
    'ledger_id', ledger_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to finalize True/False quiz session
CREATE OR REPLACE FUNCTION finish_true_false_round(
  p_total_questions INTEGER,
  p_correct_answers INTEGER,
  p_duration_ms INTEGER DEFAULT 0,
  p_session_data JSONB DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
  current_user_id UUID;
  accuracy DECIMAL(5,2);
  base_diamonds INTEGER;
  diamonds_earned INTEGER;
  session_id UUID;
  already_rewarded_today BOOLEAN;
  wallet_id UUID;
  new_balance INTEGER;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'User not authenticated');
  END IF;
  
  -- Validate inputs
  IF p_total_questions <= 0 OR p_correct_answers < 0 OR p_correct_answers > p_total_questions THEN
    RETURN jsonb_build_object('error', 'Invalid quiz data');
  END IF;
  
  -- Calculate accuracy
  accuracy := (p_correct_answers::DECIMAL / p_total_questions::DECIMAL) * 100;
  
  -- Check if user already received reward today
  SELECT EXISTS(
    SELECT 1 FROM quiz_sessions 
    WHERE user_id = current_user_id 
      AND game_type = 'tacno_netacno' 
      AND rewarded_boolean = TRUE 
      AND created_date = CURRENT_DATE
  ) INTO already_rewarded_today;
  
  -- Calculate diamonds (only if not already rewarded today and meets minimum requirements)
  IF NOT already_rewarded_today AND p_total_questions >= 5 THEN
    base_diamonds := CEIL(p_total_questions::DECIMAL / 10);
    
    -- Apply accuracy multiplier
    IF accuracy >= 100 THEN
      diamonds_earned := base_diamonds * 3;
    ELSIF accuracy >= 80 THEN
      diamonds_earned := base_diamonds * 2;
    ELSIF accuracy >= 60 THEN
      diamonds_earned := base_diamonds * 1;
    ELSE
      diamonds_earned := 0;
    END IF;
  ELSE
    diamonds_earned := 0;
  END IF;
  
  -- Create quiz session record
  INSERT INTO quiz_sessions (
    user_id, game_type, num_questions, num_correct, 
    accuracy_float, duration_ms, rewarded_boolean, rewarded_diamonds, session_data
  )
  VALUES (
    current_user_id, 'tacno_netacno', p_total_questions, p_correct_answers,
    accuracy, p_duration_ms, diamonds_earned > 0, diamonds_earned, p_session_data
  )
  RETURNING id INTO session_id;
  
  -- Award diamonds if earned
  IF diamonds_earned > 0 THEN
    wallet_id := get_or_create_wallet(current_user_id);
    
    UPDATE user_wallets 
    SET diamonds_balance = diamonds_balance + diamonds_earned,
        updated_at = NOW()
    WHERE id = wallet_id
    RETURNING diamonds_balance INTO new_balance;
    
    -- Create ledger entry
    INSERT INTO diamond_ledger (user_id, wallet_id, amount, direction, source, metadata)
    VALUES (current_user_id, wallet_id, diamonds_earned, 'earn', 'tacno_netacno', 
            jsonb_build_object('session_id', session_id, 'accuracy', accuracy));
  ELSE
    -- Get current balance even if no diamonds earned
    SELECT diamonds_balance INTO new_balance
    FROM user_wallets 
    WHERE user_id = current_user_id;
    
    IF new_balance IS NULL THEN
      new_balance := 0;
    END IF;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', session_id,
    'accuracy', accuracy,
    'diamonds_earned', diamonds_earned,
    'new_balance', new_balance,
    'already_rewarded_today', already_rewarded_today
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamond_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

DROP POLICY IF EXISTS "Users can view own wallet" ON user_wallets;
DROP POLICY IF EXISTS "Users can insert own wallet" ON user_wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON user_wallets;

DROP POLICY IF EXISTS "Users can view own ledger" ON diamond_ledger;
DROP POLICY IF EXISTS "Users can insert own ledger" ON diamond_ledger;

DROP POLICY IF EXISTS "Users can view own sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON quiz_sessions;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Wallet policies
CREATE POLICY "Users can view own wallet" ON user_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON user_wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON user_wallets FOR UPDATE USING (auth.uid() = user_id);

-- Ledger policies
CREATE POLICY "Users can view own ledger" ON diamond_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ledger" ON diamond_ledger FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quiz sessions policies
CREATE POLICY "Users can view own sessions" ON quiz_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON quiz_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
