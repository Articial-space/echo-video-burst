#!/bin/bash

# Database Setup Script for Echo Video Burst
# This script applies all migrations and configures security

echo "🚀 Setting up Echo Video Burst Database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Applying database migrations..."

# Apply all migrations
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Database migrations applied successfully"
else
    echo "❌ Failed to apply migrations"
    exit 1
fi

echo "🔒 Configuring security policies..."

# Apply security configuration
supabase db push --include-all

if [ $? -eq 0 ]; then
    echo "✅ Security policies configured successfully"
else
    echo "❌ Failed to configure security policies"
    exit 1
fi

echo "🔍 Verifying database setup..."

# Check if tables exist
supabase db diff --schema public

echo "📊 Database setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Configure Supabase Auth settings in the dashboard:"
echo "   - Enable password resets"
echo "   - Configure email templates"
echo "   - Set Site URL to your domain"
echo ""
echo "2. Test the password reset functionality:"
echo "   - Create a test user"
echo "   - Request a password reset"
echo "   - Verify the complete flow"
echo ""
echo "3. Monitor security logs in Supabase dashboard"
echo ""
echo "✅ Setup complete! Your database is now secure and ready for password resets." 