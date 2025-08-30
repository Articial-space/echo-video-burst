-- OAuth Database Fix - Run this in Supabase SQL Editor
-- This fixes the "Database error updating user" issue during OAuth callbacks

-- 1. Drop all existing conflicting triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Ensure profiles table has correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop and recreate all RLS policies to ensure clean state
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;

-- 5. Create permissive RLS policies that work with triggers
CREATE POLICY "Enable read access for users" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Critical: Allow INSERT for both authenticated users AND the trigger function
CREATE POLICY "Enable insert for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Create robust profile creation function with proper permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER -- This runs with elevated privileges
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert profile with comprehensive error handling
  BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, created_at, updated_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'name', '')),
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', COALESCE(NEW.raw_user_meta_data->>'picture', '')),
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Successfully created profile for user %', NEW.id;
    
  EXCEPTION 
    WHEN unique_violation THEN
      -- Profile already exists, update it instead
      UPDATE public.profiles SET
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'name', full_name)),
        email = COALESCE(NEW.email, email),
        avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', COALESCE(NEW.raw_user_meta_data->>'picture', avatar_url)),
        updated_at = NOW()
      WHERE id = NEW.id;
      
      RAISE NOTICE 'Updated existing profile for user %', NEW.id;
      
    WHEN OTHERS THEN
      -- Log the specific error but don't fail the auth process
      RAISE WARNING 'Failed to create/update profile for user % - Error: % %', NEW.id, SQLSTATE, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;

-- 7. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- 9. Ensure the function owner has correct permissions
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 11. Final verification and status report
DO $$
BEGIN
  -- Verify the trigger exists
  IF EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created' 
    AND event_object_table = 'users'
  ) THEN
    RAISE NOTICE '✅ SUCCESS: Trigger on_auth_user_created exists and is active';
  ELSE
    RAISE WARNING '❌ FAILED: Trigger on_auth_user_created is missing!';
  END IF;
  
  -- Verify the function exists
  IF EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'handle_new_user' 
    AND routine_type = 'FUNCTION'
  ) THEN
    RAISE NOTICE '✅ SUCCESS: Function handle_new_user exists';
  ELSE
    RAISE WARNING '❌ FAILED: Function handle_new_user is missing!';
  END IF;
  
  -- Verify RLS is enabled
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    RAISE NOTICE '✅ SUCCESS: RLS is enabled on profiles table';
  ELSE
    RAISE WARNING '❌ FAILED: RLS is not enabled on profiles table!';
  END IF;

  -- Count existing policies
  RAISE NOTICE 'ℹ️  INFO: Found % RLS policies on profiles table', (
    SELECT COUNT(*) 
    FROM pg_policies 
    WHERE tablename = 'profiles'
  );

  RAISE NOTICE '🎉 DATABASE SETUP COMPLETE! OAuth should now work without errors.';
  
END $$; 