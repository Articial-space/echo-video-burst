# Password Reset Functionality Setup

This document explains how the password reset functionality works and how to configure it properly.

## Overview

The password reset functionality allows users to:
1. Request a password reset email from the sign-in page
2. Click the reset link in their email
3. Set a new password on the reset password page

## Implementation Details

### Frontend Components

1. **SignIn.tsx** - Added "Forgot password?" link
2. **ForgotPassword.tsx** - New page for requesting password reset
3. **ResetPassword.tsx** - New page for setting new password
4. **AuthContext.tsx** - Added `resetPassword` function

### Backend (Supabase)

The password reset functionality uses Supabase Auth's built-in password reset feature:

- `supabase.auth.resetPasswordForEmail()` - Sends reset email
- `supabase.auth.updateUser()` - Updates password after reset

## Configuration Steps

### 1. Supabase Dashboard Configuration

1. **Enable Password Reset in Auth Settings:**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Settings
   - Ensure "Enable email confirmations" is enabled
   - Ensure "Enable password resets" is enabled

2. **Configure Email Templates:**
   - Go to Authentication > Email Templates
   - Edit the "Password Reset" template
   - Customize the email content as needed
   - Ensure the reset URL points to your app's `/reset-password` route

3. **Set Site URL:**
   - In Authentication > Settings > Site URL
   - Set to your production domain (e.g., `https://yourdomain.com`)
   - For development, use `http://localhost:5173`

### 2. Environment Variables

Ensure your Supabase configuration is properly set up in your environment:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Migration

Run the migration to ensure the database is prepared:

```bash
supabase db push
```

## Usage Flow

### For Users

1. **Request Reset:**
   - Go to `/signin`
   - Click "Forgot password?"
   - Enter email address
   - Click "Send Reset Email"

2. **Reset Password:**
   - Check email for reset link
   - Click the link (redirects to `/reset-password`)
   - Enter new password and confirm
   - Click "Update Password"

### For Developers

The password reset flow is handled automatically by Supabase Auth. The frontend components provide a user-friendly interface for this process.

## Security Features

- **Email Validation:** Only registered emails can request password resets
- **Token Expiration:** Reset tokens expire after a set time
- **Secure Password Requirements:** Minimum 8 characters
- **Rate Limiting:** Supabase handles rate limiting for reset requests

## Troubleshooting

### Common Issues

1. **Reset emails not received:**
   - Check spam folder
   - Verify email address is correct
   - Check Supabase email settings

2. **Reset link not working:**
   - Ensure Site URL is configured correctly
   - Check that the reset token hasn't expired
   - Verify the `/reset-password` route is accessible

3. **Password update fails:**
   - Ensure password meets minimum requirements (8 characters)
   - Check that the user is properly authenticated
   - Verify Supabase Auth is properly configured

### Debug Steps

1. Check browser console for errors
2. Verify Supabase client configuration
3. Check Supabase dashboard logs
4. Ensure all routes are properly configured in the app

## Testing

To test the password reset functionality:

1. Create a test user account
2. Request a password reset
3. Check email for reset link
4. Follow the reset process
5. Verify you can sign in with the new password

## Production Deployment

When deploying to production:

1. Update Site URL in Supabase dashboard
2. Configure production email templates
3. Test the complete flow in production environment
4. Monitor for any issues in Supabase logs

## Additional Notes

- The password reset functionality is fully integrated with the existing authentication system
- Users can still sign in with Google OAuth as before
- The reset process is secure and follows best practices
- All error handling and user feedback is implemented 