# Enhanced Diamond Rewards System

## Overview
This document describes the enhanced diamond rewards system implemented for the historical quiz application. The system includes improved database schema, secure wallet management, daily challenges, and a weighted leaderboard algorithm.

## Key Features

### 🏦 Wallet System
- **Secure server-side storage** using Supabase with Row Level Security (RLS)
- **Dual-client architecture**: Local storage for responsiveness + server for persistence
- **Transaction logging** for complete audit trail
- **Atomic operations** to prevent race conditions

### 🎯 Quiz Rewards
- **Performance-based rewards** using accuracy tiers:
  - 100% accuracy: 3× base multiplier
  - ≥80% accuracy: 2× base multiplier
  - ≥60% accuracy: 1× base multiplier
  - <60% accuracy: No reward
- **Base formula**: `ceil(questions / 10)` base diamonds
- **Daily limits**: One rewarded game per day per user per mode

### 📅 Daily Challenge
- **Daily rotating questions** based on historical events
- **1 diamond reward** for correct answers
- **Once-per-day claiming** to prevent abuse
- **Deterministic selection** for fair distribution

### 🏆 Improved Leaderboard
- **Weighted scoring algorithm**:
  ```
  score = round((accuracy × 100) × ln(1 + question_count) × 100)
  ```
- **Benefits longer quizzes** while rewarding accuracy
- **Time-based filtering** (7 days, 30 days, all time)
- **Privacy controls** for anonymous participation

### 🎮 Power-ups System
- **50/50**: Remove two incorrect answers (2 diamonds)
- **Skip**: Skip current question (1 diamond)
- **Remove One**: Remove one incorrect answer (1 diamond)
- **Real-time balance checking**

## Database Schema

### Tables
```sql
profiles (id, username, created_at)
wallet_balances (user_id, diamonds, updated_at)
wallet_transactions (id, user_id, delta, reason, metadata, created_at)
quiz_sessions (id, user_id, mode, question_count, correct_count, duration_ms, played_on, reward_granted)
daily_challenge_claims (user_id, challenge_date, granted)
```

### Security
- **Row Level Security (RLS)** enabled on all tables
- **SECURITY DEFINER functions** for wallet operations
- **User isolation** - users can only access their own data
- **Guest support** - null user_id for anonymous sessions

## API Endpoints

### Quiz Finalization
```typescript
POST /api/quiz/finalize
{
  "mode": "true_false",
  "questionCount": 10,
  "correctCount": 8,
  "durationMs": 45000
}
```

**Response**:
```typescript
{
  "success": true,
  "session_id": "uuid",
  "accuracy": 80.0,
  "earned_this_game": 2,
  "total_balance": 15,
  "already_played_today": false,
  "requires_login_for_rewards": false
}
```

### Daily Challenge
```typescript
POST /api/quiz/daily-challenge/finalize
{
  "correct": true,
  "selectedYear": 1914,
  "correctYear": 1914,
  "questionTitle": "Sarajevo Assassination"
}
```

**Response**:
```typescript
{
  "success": true,
  "correct": true,
  "earned": 1,
  "total_balance": 16,
  "locked_until": "2024-01-02T00:00:00.000Z"
}
```

### Power-ups
```typescript
POST /api/wallet/spend
{
  "helpType": "fiftyFifty",
  "metadata": {}
}
```

**Response**:
```typescript
{
  "ok": true,
  "totalBalance": 14,
  "helpType": "fiftyFifty",
  "cost": 2
}
```

### Leaderboard
```typescript
GET /api/leaderboard?period=30&page=1&pageSize=20
```

**Response**:
```typescript
{
  "success": true,
  "period": "30",
  "page": 1,
  "page_size": 20,
  "total_count": 150,
  "data": [
    {
      "rank": 1,
      "user_id": "uuid",
      "username": "historian123",
      "mode": "true_false",
      "question_count": 20,
      "correct_count": 18,
      "accuracy": 90.0,
      "duration_ms": 120000,
      "score": 1247,
      "created_at": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

## Environment Variables

Required Supabase configuration:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Migration Instructions

1. **Backup your database** before applying migrations
2. **Apply the schema**: Run the SQL in `lib/database-schema.sql` in your Supabase SQL editor
3. **Verify migration**: Check that all tables are created with correct constraints
4. **Test functions**: Verify RPC functions work correctly
5. **Update client code**: Ensure all API calls use new function signatures

## Scoring Algorithm Details

The leaderboard uses a weighted scoring system that rewards both accuracy and quiz length:

```typescript
score = round((accuracy × 100) × ln(1 + question_count) × 100)
```

**Examples**:
- 100% accuracy, 5 questions: `100 × ln(6) × 100 ≈ 1792`
- 100% accuracy, 20 questions: `100 × ln(21) × 100 ≈ 3055`
- 80% accuracy, 20 questions: `80 × ln(21) × 100 ≈ 2444`

This formula:
- **Rewards accuracy** (higher percentage = higher score)
- **Benefits longer quizzes** (more questions = higher score)
- **Uses natural log** to provide diminishing returns for very long quizzes
- **Multiplies by 100** for readability

## Daily Challenge Selection

The daily challenge uses deterministic selection based on the current date:

```typescript
const daySeed = Number(`${year}${month}${day}`);
const eventIndex = daySeed % events.length;
const selectedEvent = events[eventIndex];
```

This ensures:
- **Same challenge every day** for all users
- **Predictable rotation** through available events
- **Fair distribution** across the event pool

## Security Considerations

- **Rate limiting** on all API endpoints
- **Authentication required** for wallet operations
- **Input validation** on all API requests
- **SQL injection prevention** via parameterized queries
- **CSRF protection** via proper headers
- **Session management** with automatic cleanup

## Performance Optimizations

- **Database indexes** on frequently queried columns
- **Connection pooling** via Supabase client
- **Caching** of static data (regions, etc.)
- **Efficient queries** with proper filtering
- **Pagination** for large result sets

## Testing

Run the manual test plan in `TESTING_MANUAL.md` to verify:
- ✅ Authentication flows
- ✅ Quiz reward calculation
- ✅ Daily challenge functionality
- ✅ Power-up system
- ✅ Leaderboard rankings
- ✅ Guest user experience
- ✅ Error handling

## Troubleshooting

### Common Issues

1. **401 Unauthorized on power-ups**
   - Check authentication state
   - Verify Supabase session is active

2. **No rewards after quiz completion**
   - Check database RPC function permissions
   - Verify user has wallet record
   - Confirm daily limit not exceeded

3. **Leaderboard not updating**
   - Check database function execution
   - Verify quiz sessions are being created

4. **Daily challenge not loading**
   - Check event data availability
   - Verify deterministic selection logic

### Debug Tools

- Use `/api/debug/diamonds` for wallet debugging
- Check Supabase logs for RPC function errors
- Monitor browser console for client-side issues

## Future Enhancements

- **Achievement system** for milestones
- **Tournament mode** with special rewards
- **Social features** (friend challenges)
- **Advanced analytics** for user behavior
- **Mobile app** integration

