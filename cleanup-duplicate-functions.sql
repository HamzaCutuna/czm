-- Clean up duplicate functions in the database
-- This script removes old/duplicate function definitions

-- Drop old wallet_grant function (integer return type)
DROP FUNCTION IF EXISTS wallet_grant(INTEGER, VARCHAR, JSONB);

-- Drop old wallet_spend function (integer return type)  
DROP FUNCTION IF EXISTS wallet_spend(INTEGER, VARCHAR, JSONB);

-- Drop old functions that reference wrong table names
DROP FUNCTION IF EXISTS create_user_wallet();

-- Drop trigger first, then function
DROP TRIGGER IF EXISTS update_wallet_on_transaction ON transactions;
DROP FUNCTION IF EXISTS update_wallet_diamonds();

-- Keep only the correct functions:
-- - wallet_grant(INTEGER, VARCHAR, JSONB) -> jsonb (correct one)
-- - wallet_spend(INTEGER, VARCHAR, JSONB) -> jsonb (correct one)
-- - get_or_create_wallet(UUID) -> uuid (correct one)

-- Verify what functions remain
SELECT 
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%wallet%'
ORDER BY routine_name;
