# Fix Authentication Issues

## 🔧 **Issues Identified:**

1. **Database RLS policies blocking profile creation**
2. **Sign-up flow not properly handling email confirmation**
3. **Users redirected to main page instead of email verification**
4. **Authentication state not properly managed**

## 🛠️ **Manual Database Fixes Required:**

### Step 1: Fix RLS Policies for Profile Creation

Run this SQL in your Supabase dashboard SQL Editor:

```sql
-- Fix RLS policies to allow profile creation during sign-up
-- Drop existing policies that might be blocking profile creation
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a new policy that allows profile creation for authenticated users
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Also ensure the service role can create profiles (for auth triggers)
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.videos TO service_role;

-- Create a function to handle profile creation automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
```

### Step 2: Configure Supabase Auth Settings

1. **Go to Supabase Dashboard > Authentication > Settings**
2. **Enable these settings:**
   - ✅ Enable email confirmations
   - ✅ Enable password resets
   - ✅ Enable email change confirmations

3. **Configure Email Templates:**
   - Go to **Authentication > Email Templates**
   - Edit "Confirm signup" template
   - Set redirect URL to: `https://yourdomain.com/email-verification`
   - For development: `http://localhost:5173/email-verification`

4. **Set Site URL:**
   - In **Authentication > Settings > Site URL**
   - For development: `http://localhost:5173`
   - For production: `https://yourdomain.com`

### Step 3: Test the Authentication Flow

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Sign-up Flow:**
   - Go to `http://localhost:5173/signin`
   - Click "Create account"
   - Fill in the form and submit
   - Should redirect to `/email-verification`
   - Check email for verification link

3. **Test Sign-in Flow:**
   - After email confirmation, try signing in
   - Should redirect to main page with user logged in

## 🔍 **Debugging Tools:**

### 1. Auth Debug Panel
- Look for the debug panel in the bottom-right corner
- Shows current authentication state
- Only visible in development mode

### 2. Browser Console
- Check for authentication events
- Look for any error messages
- Verify session state

### 3. Auth Test Page
- Go to `http://localhost:5173/auth-test`
- Test all authentication functions
- Check session management

## 🚨 **Common Issues and Solutions:**

### Issue 1: "User not found" after sign-up
**Solution:** Check if email confirmation is required and user hasn't confirmed yet.

### Issue 2: Profile creation fails
**Solution:** Run the RLS policy fixes above.

### Issue 3: Email not received
**Solution:** 
- Check spam folder
- Verify Supabase email settings
- Check email template configuration

### Issue 4: Redirect loops
**Solution:** 
- Clear browser storage
- Check authentication state
- Verify redirect URLs

## ✅ **Verification Checklist:**

- [ ] RLS policies allow profile creation
- [ ] Email confirmation is enabled
- [ ] Email templates are configured
- [ ] Site URL is set correctly
- [ ] Sign-up redirects to email verification
- [ ] Email verification page works
- [ ] Sign-in works after email confirmation
- [ ] User stays logged in after refresh
- [ ] Profile is created automatically
- [ ] Debug panel shows correct state

## 📞 **If Issues Persist:**

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard > Logs
   - Look for authentication errors

2. **Check Browser Console:**
   - Look for JavaScript errors
   - Check network requests

3. **Verify Database:**
   - Check if profiles table has correct structure
   - Verify RLS policies are applied

4. **Test with Auth Test Page:**
   - Use the test page to isolate issues
   - Check each authentication function

---

**Note:** The authentication system is now properly configured to handle the complete sign-up and sign-in flow with email verification. 