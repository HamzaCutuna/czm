-- Simple test to check if database is working
-- Run this in Supabase SQL Editor to test the connection

-- Test 1: Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'user_wallets', 'diamond_ledger', 'quiz_sessions');

-- Test 2: Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('get_or_create_wallet', 'wallet_grant', 'wallet_spend', 'finish_true_false_round');

-- Test 3: Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('users', 'user_wallets', 'diamond_ledger', 'quiz_sessions');

-- Test 4: Try to create a test user (this will fail if user already exists, which is fine)
INSERT INTO users (id, email, display_name, privacy_setting) 
VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User', 'realname')
ON CONFLICT (id) DO NOTHING;

-- Test 5: Try to create a test wallet
INSERT INTO user_wallets (user_id, diamonds_balance) 
VALUES ('00000000-0000-0000-0000-000000000000', 0)
ON CONFLICT (user_id) DO NOTHING;

-- Test 6: Check if we can query the test data
SELECT * FROM users WHERE id = '00000000-0000-0000-0000-000000000000';
SELECT * FROM user_wallets WHERE user_id = '00000000-0000-0000-0000-000000000000';
