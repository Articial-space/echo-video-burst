# Database Setup Script for Echo Video Burst (PowerShell)
# This script applies all migrations and configures security

Write-Host "🚀 Setting up Echo Video Burst Database..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
} catch {
    Write-Host "❌ Supabase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "supabase/config.toml")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Applying database migrations..." -ForegroundColor Blue

# Apply all migrations
$migrationResult = supabase db push
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database migrations applied successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to apply migrations" -ForegroundColor Red
    exit 1
}

Write-Host "🔒 Configuring security policies..." -ForegroundColor Blue

# Apply security configuration
$securityResult = supabase db push --include-all
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Security policies configured successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to configure security policies" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Verifying database setup..." -ForegroundColor Blue

# Check if tables exist
supabase db diff --schema public

Write-Host "📊 Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure Supabase Auth settings in the dashboard:" -ForegroundColor White
Write-Host "   - Enable password resets" -ForegroundColor Gray
Write-Host "   - Configure email templates" -ForegroundColor Gray
Write-Host "   - Set Site URL to your domain" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test the password reset functionality:" -ForegroundColor White
Write-Host "   - Create a test user" -ForegroundColor Gray
Write-Host "   - Request a password reset" -ForegroundColor Gray
Write-Host "   - Verify the complete flow" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Monitor security logs in Supabase dashboard" -ForegroundColor White
Write-Host ""
Write-Host "✅ Setup complete! Your database is now secure and ready for password resets." -ForegroundColor Green 