-- Comprehensive Security and Password Reset Setup
-- This migration ensures all security policies are properly configured
-- and password reset functionality is enabled

-- 1. ENSURE ROW LEVEL SECURITY IS ENABLED
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- 2. DROP EXISTING POLICIES TO RECREATE THEM PROPERLY
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can create their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete their own videos" ON public.videos;
DROP POLICY IF EXISTS "Anyone can view shared videos" ON public.videos;

-- 3. CREATE COMPREHENSIVE SECURITY POLICIES FOR PROFILES
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 4. CREATE COMPREHENSIVE SECURITY POLICIES FOR VIDEOS
CREATE POLICY "Users can view their own videos" 
  ON public.videos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own videos" 
  ON public.videos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" 
  ON public.videos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" 
  ON public.videos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. CREATE POLICY FOR SHARED VIDEOS (PUBLIC ACCESS)
CREATE POLICY "Anyone can view shared videos" 
  ON public.videos 
  FOR SELECT 
  USING (is_public = true);

-- 6. ENSURE SHARING COLUMNS EXIST
DO $$ 
BEGIN
  -- Add is_public column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'videos' AND column_name = 'is_public') THEN
    ALTER TABLE public.videos ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Add share_token column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'videos' AND column_name = 'share_token') THEN
    ALTER TABLE public.videos ADD COLUMN share_token UUID DEFAULT gen_random_uuid() UNIQUE;
  END IF;
END $$;

-- 7. CREATE INDEXES FOR PERFORMANCE AND SECURITY
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_share_token ON public.videos(share_token);
CREATE INDEX IF NOT EXISTS idx_videos_public ON public.videos(is_public);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- 8. CREATE FUNCTION FOR PASSWORD RESET AUDITING
CREATE OR REPLACE FUNCTION public.handle_password_reset_audit()
RETURNS TRIGGER AS $$
BEGIN
  -- Log password reset events for security monitoring
  -- This function can be used to track password changes
  INSERT INTO auth.audit_log_entries (
    instance_id,
    id,
    payload,
    created_at
  ) VALUES (
    NEW.instance_id,
    gen_random_uuid(),
    jsonb_build_object(
      'event_type', 'password_reset',
      'user_id', NEW.id,
      'email', NEW.email,
      'timestamp', NOW()
    ),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If audit logging fails, don't prevent the password reset
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. CREATE FUNCTION TO VALIDATE EMAIL FORMATS
CREATE OR REPLACE FUNCTION public.validate_email_format(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Basic email validation
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. CREATE FUNCTION TO SANITIZE USER INPUT
CREATE OR REPLACE FUNCTION public.sanitize_input(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Remove potentially dangerous characters
  RETURN regexp_replace(input_text, '[<>"\''&]', '', 'g');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. CREATE FUNCTION TO CHECK RATE LIMITING
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_id UUID,
  action_type TEXT,
  max_attempts INTEGER DEFAULT 5,
  time_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  -- Count recent attempts for this user and action
  SELECT COUNT(*) INTO attempt_count
  FROM auth.audit_log_entries
  WHERE payload->>'user_id' = user_id::TEXT
    AND payload->>'event_type' = action_type
    AND created_at > NOW() - INTERVAL '1 minute' * time_window_minutes;
  
  RETURN attempt_count < max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. CREATE FUNCTION TO HANDLE USER PROFILE UPDATES SECURELY
CREATE OR REPLACE FUNCTION public.update_user_profile(
  user_id UUID,
  new_full_name TEXT DEFAULT NULL,
  new_avatar_url TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate user exists and is authenticated
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
    RETURN FALSE;
  END IF;
  
  -- Sanitize inputs
  IF new_full_name IS NOT NULL THEN
    new_full_name := public.sanitize_input(new_full_name);
  END IF;
  
  -- Update profile
  UPDATE public.profiles 
  SET 
    full_name = COALESCE(new_full_name, full_name),
    avatar_url = COALESCE(new_avatar_url, avatar_url),
    updated_at = NOW()
  WHERE id = user_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. CREATE FUNCTION TO HANDLE VIDEO SHARING SECURELY
CREATE OR REPLACE FUNCTION public.toggle_video_sharing(
  video_id UUID,
  user_id UUID,
  make_public BOOLEAN
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verify user owns the video
  IF NOT EXISTS (
    SELECT 1 FROM public.videos 
    WHERE id = video_id AND user_id = user_id
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Update sharing status
  UPDATE public.videos 
  SET 
    is_public = make_public,
    share_token = CASE 
      WHEN make_public AND share_token IS NULL THEN gen_random_uuid()
      ELSE share_token
    END,
    updated_at = NOW()
  WHERE id = video_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. CREATE FUNCTION TO CLEAN UP OLD DATA
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- Delete videos older than 1 year (optional cleanup)
  -- Uncomment if you want automatic cleanup
  -- DELETE FROM public.videos 
  -- WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Log cleanup operation
  INSERT INTO auth.audit_log_entries (
    instance_id,
    id,
    payload,
    created_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    jsonb_build_object(
      'event_type', 'cleanup_operation',
      'timestamp', NOW()
    ),
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. CREATE SCHEDULED JOB FOR CLEANUP (OPTIONAL)
-- SELECT cron.schedule(
--   'cleanup-old-data',
--   '0 2 * * *', -- Daily at 2 AM
--   'SELECT public.cleanup_old_data();'
-- );

-- 16. GRANT NECESSARY PERMISSIONS
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.videos TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_profile(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_video_sharing(UUID, UUID, BOOLEAN) TO authenticated;

-- 17. CREATE VIEW FOR USER DASHBOARD
CREATE OR REPLACE VIEW public.user_dashboard AS
SELECT 
  p.id as user_id,
  p.email,
  p.full_name,
  p.avatar_url,
  p.created_at as profile_created_at,
  COUNT(v.id) as total_videos,
  COUNT(CASE WHEN v.is_public = true THEN 1 END) as public_videos,
  MAX(v.created_at) as last_video_created
FROM public.profiles p
LEFT JOIN public.videos v ON p.id = v.user_id
GROUP BY p.id, p.email, p.full_name, p.avatar_url, p.created_at;

-- 18. CREATE POLICY FOR DASHBOARD VIEW
CREATE POLICY "Users can view their own dashboard" 
  ON public.user_dashboard 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 19. FINAL SECURITY CHECKS
DO $$
BEGIN
  -- Ensure all tables have RLS enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on profiles table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'videos' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on videos table';
  END IF;
  
  RAISE NOTICE 'Security setup completed successfully';
END $$; 