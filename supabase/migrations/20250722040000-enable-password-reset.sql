-- Enable password reset functionality
-- This migration ensures that password reset is properly configured

-- Enable email confirmations and password resets in auth settings
-- Note: These settings are typically configured in the Supabase dashboard
-- This migration serves as documentation and ensures the database is ready

-- Create a function to handle password reset events (if needed)
CREATE OR REPLACE FUNCTION handle_password_reset()
RETURNS TRIGGER AS $$
BEGIN
  -- Log password reset events for security monitoring
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
      'email', NEW.email
    ),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for password reset events (optional security feature)
-- This can be enabled if you want to log password reset events
-- DROP TRIGGER IF EXISTS password_reset_trigger ON auth.users;
-- CREATE TRIGGER password_reset_trigger
--   AFTER UPDATE ON auth.users
--   FOR EACH ROW
--   WHEN (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password)
--   EXECUTE FUNCTION handle_password_reset();

-- Ensure proper RLS policies for password reset
-- The auth.users table is managed by Supabase Auth, so we don't need to modify it directly

-- Add any additional security policies if needed
-- For example, rate limiting for password reset attempts could be implemented here

-- Ensure email templates are configured in Supabase dashboard:
-- 1. Go to Authentication > Email Templates
-- 2. Configure "Password Reset" template
-- 3. Set proper redirect URLs for password reset

-- Note: The actual password reset functionality is handled by Supabase Auth
-- This migration ensures the database is prepared for it 