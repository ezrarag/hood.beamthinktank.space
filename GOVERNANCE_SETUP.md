# Dynamic Governance System Setup

## Overview

The governance system has been refactored to follow the same dynamic city-slug model as the city pages. Each city now has its own dedicated governance page that loads geographically specific data from Supabase.

## New Architecture

### File Structure
```
app/
├── governance/
│   ├── page.tsx                    # Redirects to city-specific governance
│   └── [city]/
│       └── page.tsx               # Dynamic city governance page
├── [city]/
│   └── page.tsx                   # Existing city detail page
└── components/
    └── governance/
        ├── LeadershipCard.tsx      # Reusable leadership member card
        ├── AllocationBreakdownCard.tsx # Budget allocation visualization
        └── DecisionLogsCard.tsx    # Governance decision display
lib/
└── supabase/
    └── governance.ts              # Supabase query hooks
```

## Key Features

### 1. City-Specific Governance Pages
- **Route**: `/governance/[city]` (e.g., `/governance/orlando`)
- **Data**: Loads governance data specific to the user's city
- **Fallback**: Shows "NGO still being formed" message for cities without data

### 2. Leadership Team Management
- **Student Directors**: Current students leading initiatives
- **Alumni Coordinators**: Graduates maintaining community connections
- **Community Partners**: Local organizations and professionals
- **Real-time Updates**: Avatar, bio, role, and join date tracking

### 3. Donation & Subscription Activity
- **Individual Donations**: One-time contributions
- **Subscription Revenue**: Monthly recurring payments
- **Corporate Sponsorships**: Business partnerships
- **Category Tracking**: Healthcare, education, environment, etc.

### 4. Governance Decision Logs
- **Decision Types**: Budget allocation, service expansion, policy changes
- **Status Tracking**: Proposed → Approved → Implemented → Rejected
- **Voting System**: Community voting with real-time results
- **Transparency**: Full decision history and rationale

### 5. Transparency Metrics
- **Financial Overview**: Total received vs. allocated
- **Allocation Breakdown**: Percentage distribution across categories
- **Service Unlock Progress**: Progress toward service tier thresholds
- **Real-time Updates**: Live data from Supabase

## Supabase Database Schema

### Required Tables

#### `leadership_team`
```sql
CREATE TABLE leadership_team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT CHECK (type IN ('student', 'alumni', 'community_partner')),
  avatar TEXT,
  bio TEXT,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `governance_logs`
```sql
CREATE TABLE governance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  decision_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('proposed', 'approved', 'implemented', 'rejected')),
  city TEXT NOT NULL,
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `governance_votes`
```sql
CREATE TABLE governance_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id UUID REFERENCES governance_logs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote TEXT CHECK (vote IN ('for', 'against')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(log_id, user_id)
);
```

#### `budget_allocations`
```sql
CREATE TABLE budget_allocations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('proposed', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `service_tiers`
```sql
CREATE TABLE service_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  threshold INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Environment Variables

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage Examples

### Adding a Leadership Member
```typescript
import { addLeadershipMember } from '@/lib/supabase/governance'

const newMember = await addLeadershipMember({
  name: 'Sarah Chen',
  role: 'Student Director',
  type: 'student',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Computer Science major...',
  city: 'orlando'
})
```

### Submitting a Vote
```typescript
import { submitVote } from '@/lib/supabase/governance'

const success = await submitVote('log-id-123', 'user-id-456', 'for')
```

### Fetching City Governance Data
```typescript
import { getLeadershipByCity, getGovernanceLogsByCity } from '@/lib/supabase/governance'

const [leadership, logs] = await Promise.all([
  getLeadershipByCity('orlando'),
  getGovernanceLogsByCity('orlando')
])
```

## Component Usage

### LeadershipCard
```tsx
import LeadershipCard from '@/components/governance/LeadershipCard'

<LeadershipCard 
  member={leadershipMember} 
  index={0} 
/>
```

### AllocationBreakdownCard
```tsx
import AllocationBreakdownCard from '@/components/governance/AllocationBreakdownCard'

<AllocationBreakdownCard 
  allocationBreakdown={metrics.allocation_breakdown} 
/>
```

### DecisionLogsCard
```tsx
import DecisionLogsCard from '@/components/governance/DecisionLogsCard'

<DecisionLogsCard 
  governanceLogs={logs}
  onVote={handleVote}
  currentUserId={userId}
/>
```

## Migration from Static Governance

### 1. Update Navigation Links
Change all `/governance` links to use the dynamic route:
```tsx
// Before
<Link href="/governance">Governance</Link>

// After
<Link href={`/governance/${citySlug}`}>Governance</Link>
```

### 2. Update City Page Links
Add governance links to city pages:
```tsx
<button 
  onClick={() => router.push(`/governance/${city}`)}
  className="text-sm font-light text-gray-900 hover:text-blue-600"
>
  Governance
</button>
```

### 3. Handle Fallback Cases
For cities without governance data:
```tsx
if (!hasGovernanceData) {
  return <GovernanceFallback city={city} />
}
```

## Future Enhancements

### 1. Real-time Updates
- WebSocket integration for live voting results
- Push notifications for decision updates
- Live chat during governance meetings

### 2. Advanced Analytics
- Decision impact tracking
- Community engagement metrics
- ROI analysis for funded projects

### 3. Multi-language Support
- Localized governance content
- Cultural adaptation for different regions
- Translation services

### 4. Mobile App Integration
- Native mobile governance app
- Offline voting capabilities
- Push notification system

## Troubleshooting

### Common Issues

1. **City Not Found**: Ensure city slug matches database records
2. **Missing Data**: Check Supabase table permissions and data
3. **Voting Errors**: Verify user authentication and vote validation
4. **Performance Issues**: Implement pagination for large datasets

### Debug Mode
Enable debug logging in development:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Governance data:', { leadership, logs, metrics })
}
```

## Support

For technical support or questions about the governance system:
- Check Supabase logs for database errors
- Verify environment variables are set correctly
- Ensure all required tables exist with proper schemas
- Test with sample data before production deployment
