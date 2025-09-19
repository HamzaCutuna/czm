# Diamonds Rewards System Documentation

## Overview

The diamonds rewards system is a comprehensive gamification feature that rewards users with virtual diamonds (💎) for completing True/False quizzes and allows them to spend diamonds on helpful power-ups in the main quiz.

## System Architecture

### Database Schema

The system uses the following main tables:

- **`users`** - User profiles with privacy settings
- **`user_wallets`** - Diamond balances for each user
- **`diamond_ledger`** - Complete transaction history
- **`quiz_sessions`** - Game session records with rewards

### Key Components

1. **Rewards Configuration** (`lib/rewards-config.ts`)
2. **API Endpoints** (`app/api/`)
3. **UI Components** (`components/quiz/`)
4. **Rate Limiting** (`lib/rate-limit.ts`)

## Reward Rules

### True/False Quiz Rewards

- **Minimum Questions**: 5 questions required for any reward
- **Daily Limit**: One rewarded game per user per day
- **Base Formula**: `ceil(num_questions / 10)`
- **Accuracy Tiers**:
  - 100% → 3× base diamonds
  - ≥80% → 2× base diamonds  
  - ≥60% → 1× base diamonds
  - <60% → 0 diamonds

### Example Calculations

- 10 questions, 80% accuracy: `ceil(10/10) × 2 = 2` diamonds
- 15 questions, 100% accuracy: `ceil(15/10) × 3 = 6` diamonds
- 5 questions, 50% accuracy: `0` diamonds (below 60%)

## Help System (Quiz Power-ups)

Users can spend diamonds on helpful power-ups during the main quiz:

- **50/50**: Remove 2 wrong answers (2 💎)
- **Skip**: Skip current question (1 💎)
- **Remove One**: Remove 1 wrong answer (1 💎)

## API Endpoints

### Quiz Finalization
```
POST /api/quiz/tf/finalize
```
Finalizes a True/False quiz session and awards diamonds.

**Request Body:**
```json
{
  "totalQuestions": 10,
  "correctAnswers": 8,
  "durationMs": 120000,
  "sessionData": {}
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "accuracy": 80.0,
  "diamondsEarned": 2,
  "newBalance": 15,
  "rewardedToday": false
}
```

### Wallet Operations
```
GET /api/wallet
POST /api/wallet/spend
```

### Leaderboard
```
GET /api/leaderboard?scope=daily&page=1&pageSize=20
```

**Scopes:**
- `daily` - Today's results
- `weekly` - This week's results
- `monthly` - This month's results
- `all` - All-time results

## Configuration

All reward rules are centralized in `lib/rewards-config.ts`:

```typescript
export const DEFAULT_REWARDS_CONFIG: RewardsConfig = {
  MIN_QUESTIONS_FOR_REWARD: 5,
  ONE_REWARDED_GAME_PER_DAY: true,
  BASE_DIAMONDS_FORMULA: (numQuestions: number) => Math.ceil(numQuestions / 10),
  ACCURACY_TIERS: [
    { minPercent: 100, multiplier: 3, label: '100% → 3× baza' },
    { minPercent: 80, multiplier: 2, label: '≥80% → 2× baza' },
    { minPercent: 60, multiplier: 1, label: '≥60% → 1× baza' },
    { minPercent: 0, multiplier: 0, label: '<60% → 0' },
  ],
  HELP_COSTS: {
    fiftyFifty: 2,
    skip: 1,
    removeOne: 1,
  },
  LEADERBOARD_PAGE_SIZE: 20,
  PRIVACY_DEFAULT: 'realname',
};
```

## Anti-Cheat Measures

### Rate Limiting

The system implements rate limiting to prevent abuse:

- **Quiz Finalization**: 5 requests per minute per user
- **Wallet Spend**: 10 requests per minute per user
- **Leaderboard**: 20 requests per minute per user
- **Wallet Info**: 30 requests per minute per user

### Server-Side Validation

- All reward calculations are performed server-side
- Quiz answers are verified against the database
- Daily reward limits are enforced at the database level
- Unique constraints prevent duplicate rewards

### Security Features

- Row Level Security (RLS) policies protect user data
- All API endpoints require authentication
- Transaction integrity is maintained through database constraints
- Idempotency tokens prevent duplicate submissions

## Database Functions

### Core Functions

- `get_or_create_wallet(user_id)` - Creates wallet if needed
- `wallet_grant(amount, reason, metadata)` - Awards diamonds
- `wallet_spend(amount, reason, metadata)` - Spends diamonds
- `finish_true_false_round(...)` - Processes quiz completion
- `get_leaderboard(scope, page, page_size)` - Retrieves leaderboard

### Constraints

- Unique constraint ensures one rewarded game per day per user
- Check constraints validate diamond amounts and accuracy percentages
- Foreign key constraints maintain referential integrity

## UI Components

### Reward Calculator (`components/quiz/RewardCalculator.tsx`)
- Read-only display of expected rewards
- Shows accuracy tiers and requirements
- Updates dynamically with question count changes

### Powerup Bar (`components/quiz/PowerupBar.tsx`)
- Displays current diamond balance
- Provides help buttons with costs
- Handles diamond spending with validation

### Leaderboard (`components/quiz/Leaderboard.tsx`)
- Tabbed interface for different time scopes
- Real-time data fetching
- Responsive design with ranking icons

## Maintenance

### Changing Reward Rules

1. Update `DEFAULT_REWARDS_CONFIG` in `lib/rewards-config.ts`
2. The UI will automatically reflect the new rules
3. No database migration needed for rule changes

### Adding New Help Types

1. Add new help type to `HELP_COSTS` in config
2. Update `PowerupBar` component to include new button
3. Add handling logic in quiz page
4. Update database function if needed

### Monitoring

- Check `diamond_ledger` table for transaction history
- Monitor `quiz_sessions` for game completion rates
- Review rate limiting logs for abuse patterns

## Deployment Notes

### Database Setup

1. Run the SQL schema from `lib/database-schema.sql`
2. Ensure Supabase RLS policies are active
3. Grant necessary permissions to authenticated users

### Environment Variables

Ensure these Supabase environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Production Considerations

- Consider implementing Redis for rate limiting in production
- Add monitoring for diamond economy balance
- Set up alerts for unusual spending patterns
- Consider implementing diamond caps or daily limits

## Troubleshooting

### Common Issues

1. **"Rate limit exceeded"** - User is making too many requests
2. **"Insufficient diamonds"** - User doesn't have enough diamonds for help
3. **"Already rewarded today"** - User has already received daily reward
4. **"Invalid quiz data"** - Malformed request data

### Debug Steps

1. Check user authentication status
2. Verify diamond balance in `user_wallets` table
3. Review recent transactions in `diamond_ledger`
4. Check quiz session records for completion status
5. Verify rate limiting status

## Future Enhancements

- Diamond purchase system
- Achievement badges
- Streak bonuses
- Seasonal events
- Diamond trading between users
- Advanced analytics dashboard
