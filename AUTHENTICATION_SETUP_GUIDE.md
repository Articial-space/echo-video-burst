# Authentication Setup Guide

## Issues Fixed in Code ✅
1. Get Started button now redirects to sign-up mode
2. URL parameters control sign-in/sign-up mode
3. Enhanced error logging for debugging
4. Improved Supabase client configuration
5. Database profile creation trigger

## Required Supabase Dashboard Configuration

### 1. Google OAuth Setup (Critical)

**Step 1: Get Google OAuth Credentials**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set Application type to "Web application"
6. Add Authorized redirect URIs:
   - `https://akynyenmqbgejtczgysv.supabase.co/auth/v1/callback`
   - `http://localhost:5173` (for development)
7. Copy the Client ID and Client Secret

**Step 2: Configure in Supabase**
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Providers
3. Enable Google provider
4. Paste your Google Client ID and Client Secret
5. Click Save

### 2. Email Authentication Settings

1. Go to Authentication → Settings
2. Ensure these are enabled:
   - ✅ Enable email confirmations
   - ✅ Enable password resets
   - ✅ Enable sign ups

3. Set Site URL:
   - Production: `https://yourdomain.com`
   - Development: `http://localhost:5173`

4. Add Redirect URLs:
   - `http://localhost:5173/email-verification`
   - `http://localhost:5173/reset-password`
   - `http://localhost:5173/`

### 3. Database Setup

**Option 1: Manual SQL (Recommended)**
Run this SQL in your Supabase SQL Editor:

```sql
-- Ensure profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create RLS policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

**Option 2: Using Supabase CLI**
```bash
npx supabase db push
```

## Testing the Authentication

### 1. Test Email Sign Up
1. Go to `/signin?mode=signup`
2. Fill in full name, email, password
3. Check for email verification
4. Verify user appears in Authentication → Users

### 2. Test Google Sign In
1. Click "Continue with Google" button
2. Should redirect to Google OAuth
3. After authorization, should redirect back to app
4. Check user appears in Authentication → Users

### 3. Test Get Started Flow
1. Click "Get Started" button from homepage
2. Should go to sign-up form (not sign-in)
3. Complete registration flow

## Debugging Authentication Issues

### Check Browser Console
Look for these debug messages:
- "Attempting sign up for: [email]"
- "Sign up successful: [data]"
- "Attempting Google sign in..."
- "Google sign in initiated: [data]"

### Check Supabase Dashboard
1. Go to Authentication → Users
2. Verify new users appear after registration
3. Check Logs for any errors

### Common Issues & Solutions

**Issue: "User already registered"**
- Solution: User exists but may not be confirmed. Check email for verification link.

**Issue: Google OAuth fails**
- Solution: Verify OAuth credentials and redirect URIs in Google Console and Supabase.

**Issue: User not created in database**
- Solution: Run the profile creation SQL manually in Supabase SQL Editor.

**Issue: RLS policies blocking access**
- Solution: Verify RLS policies are correctly applied using the SQL above.

## Environment Variables

Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://akynyenmqbgejtczgysv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Next Steps

1. ✅ Apply Google OAuth configuration in Supabase dashboard
2. ✅ Run the database SQL to create profiles table and trigger
3. ✅ Test sign-up flow with email
4. ✅ Test Google OAuth flow
5. ✅ Verify users are created in both auth.users and public.profiles

## Support

If issues persist:
1. Check browser console for error messages
2. Check Supabase dashboard logs
3. Verify all configuration steps are completed
4. Test with different browsers/incognito mode 