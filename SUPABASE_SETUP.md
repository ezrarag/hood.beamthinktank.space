# 🚀 Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Getting Your Supabase Credentials

1. **Go to [Supabase Dashboard](https://app.supabase.com)**
2. **Select your project** (or create a new one)
3. **Go to Settings > API**
4. **Copy the following values:**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Setup

Run these SQL commands in your Supabase SQL Editor:

### 1. Create Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Create Participants Table
```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  university TEXT NOT NULL,
  status TEXT CHECK (status IN ('enrolled', 'alumni')),
  role TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Enable Row Level Security (RLS)
```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = supabase_id::text);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = supabase_id::text);

-- Participants can only access their own data
CREATE POLICY "Participants can view own data" ON participants
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Participants can insert own data" ON participants
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Participants can update own data" ON participants
  FOR UPDATE USING (auth.uid()::text = user_id::text);
```

## Google OAuth Setup

1. **Go to Authentication > Providers in Supabase**
2. **Enable Google provider**
3. **Get Google OAuth credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for development)

4. **Add credentials to Supabase:**
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret

## Testing the Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Click "Login" in the header**
3. **Try Google OAuth sign-in**
4. **Check the browser console for any errors**
5. **Verify data is being created in Supabase tables**

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error:**
   - Check your `.env.local` file
   - Verify the anon key is correct
   - Restart your dev server

2. **"OAuth provider not configured" error:**
   - Ensure Google provider is enabled in Supabase
   - Check OAuth credentials are correct
   - Verify redirect URIs match

3. **"Table doesn't exist" error:**
   - Run the SQL commands in Supabase SQL Editor
   - Check table names match exactly
   - Verify RLS policies are created

4. **"Permission denied" error:**
   - Check RLS policies are enabled
   - Verify user authentication is working
   - Check table permissions

### Debug Mode:

Add this to your component to see detailed logs:
```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
```

## Next Steps

Once Supabase is working:

1. **Test the complete authentication flow**
2. **Verify participant onboarding works**
3. **Check dashboard routing**
4. **Test governance integration**
5. **Remove any remaining mock data**

## Support

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Google OAuth**: [https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)
- **Next.js Auth**: [https://nextjs.org/docs/authentication](https://nextjs.org/docs/authentication)

---

**🎉 Your authentication system is now ready for real Supabase integration!**
