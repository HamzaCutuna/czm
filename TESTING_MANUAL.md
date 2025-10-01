# Manual Testing Plan - Diamond Rewards System

## Overview
This document outlines the manual testing procedures for the enhanced diamond rewards system, daily challenges, and leaderboard functionality.

## Test Environment
- Next.js application running locally
- Supabase database with new schema applied
- Chrome/Firefox browser for testing

## Test Data Setup
1. Create test user accounts (both @edu.fit.ba and @gmail.com)
2. Ensure database has sample historical events
3. Clear any existing test data

## Test Cases

### 1. Authentication & Diamond Display
**Objective**: Verify diamond counter behavior for authenticated vs guest users

**Steps**:
1. Navigate to the homepage as a guest user
2. Verify diamond counter is not visible in navbar
3. Sign in with a test account
4. Verify diamond counter appears with correct balance
5. Navigate to quiz pages
6. Verify diamond counter shows for authenticated users only

**Expected Results**:
- ✅ Guest users see no diamond counter
- ✅ Authenticated users see diamond counter with current balance
- ✅ Quiz pages show appropriate messaging for guests

### 2. True/False Quiz - Reward System
**Objective**: Test quiz completion and diamond rewards

**Steps**:
1. Sign in with test account
2. Navigate to True/False quiz
3. Select 10 questions and start game
4. Answer all questions (aim for different accuracy levels)
5. Complete the quiz
6. Verify result screen shows:
   - "You earned: X diamonds" (correct amount)
   - "Total balance: Y diamonds" (updated total)
   - Accuracy percentage
7. Play again on the same day
8. Verify no additional rewards but quiz completes normally

**Expected Results**:
- ✅ First game awards diamonds based on accuracy
- ✅ Subsequent games on same day show "already played today" message
- ✅ Total balance updates correctly
- ✅ Quiz always completes even without rewards

### 3. Daily Challenge
**Objective**: Test daily challenge functionality

**Steps**:
1. Sign in with test account
2. Navigate to Daily Challenge page
3. Verify challenge loads with today's date
4. Answer the question correctly
5. Verify +1 diamond reward
6. Refresh page and verify challenge shows as completed
7. Try to answer again (should show locked/completed state)

**Expected Results**:
- ✅ Challenge loads with proper question
- ✅ Correct answer grants 1 diamond
- ✅ Challenge locks after completion
- ✅ Balance updates correctly

### 4. Power-ups System
**Objective**: Test diamond spending for game assistance

**Steps**:
1. Ensure test account has sufficient diamonds (10+)
2. Start a True/False quiz
3. Use each power-up:
   - 50/50 (costs 2 diamonds)
   - Skip (costs 1 diamond)
   - Remove wrong answer (costs 1 diamond)
4. Verify each power-up applies correctly
5. Check diamond balance decreases appropriately
6. Try using power-ups with insufficient diamonds

**Expected Results**:
- ✅ Power-ups deduct correct diamond amounts
- ✅ Power-up effects work as intended
- ✅ Insufficient funds shows appropriate error
- ✅ Balance updates in real-time

### 5. Leaderboard
**Objective**: Test improved leaderboard with weighted scoring

**Steps**:
1. Complete multiple quiz sessions with different:
   - Question counts (5, 10, 15, 20)
   - Accuracy levels (50%, 80%, 100%)
2. Navigate to leaderboard page
3. Test different time periods (7 days, 30 days, all time)
4. Verify ranking considers both accuracy and question count
5. Check that longer quizzes with good accuracy rank higher

**Expected Results**:
- ✅ Leaderboard loads with proper rankings
- ✅ Weighted scoring favors longer quizzes appropriately
- ✅ Different time periods show correct data
- ✅ Rankings update correctly after new sessions

### 6. Guest User Experience
**Objective**: Verify proper experience for non-authenticated users

**Steps**:
1. Access application as guest (not signed in)
2. Try to access quiz games
3. Verify diamond counter is hidden
4. Try to use power-ups (should prompt for login)
5. Complete a quiz as guest
6. Verify no rewards are granted

**Expected Results**:
- ✅ No diamond counter visible
- ✅ Quiz completion works but shows no rewards
- ✅ Power-ups prompt for authentication
- ✅ Clear messaging about signing in for rewards

### 7. Edge Cases & Error Handling
**Objective**: Test system robustness

**Steps**:
1. Test quiz completion with network interruption
2. Test rapid clicking/submitting
3. Test with very slow network
4. Test database connection issues
5. Test malformed API requests

**Expected Results**:
- ✅ System handles errors gracefully
- ✅ User gets appropriate feedback
- ✅ No data corruption occurs
- ✅ Retry mechanisms work properly

## Bug Reporting
If any test fails, document:
- Steps to reproduce
- Expected vs actual behavior
- Browser and environment details
- Console errors (if any)
- Screenshots (if UI issue)

## Success Criteria
All tests pass with expected results, demonstrating:
- ✅ Proper diamond reward calculation
- ✅ Secure wallet management
- ✅ Guest user experience
- ✅ Daily challenge functionality
- ✅ Power-up system
- ✅ Improved leaderboard
- ✅ Error handling and recovery

