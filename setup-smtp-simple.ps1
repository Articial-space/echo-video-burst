# Echo Video Burst - Simple SMTP Setup Helper
Write-Host "🚀 Echo Video Burst - SMTP Setup Helper" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "🔍 Checking Node.js..." -ForegroundColor Yellow
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCheck) {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Blue
    Read-Host "Press Enter to exit"
    return
}

Write-Host ""
Write-Host "📋 SMTP Setup Options:" -ForegroundColor Cyan
Write-Host "1. 📖 View setup guide"
Write-Host "2. 🔧 Run automated setup"
Write-Host "3. 🧪 Test email configuration"
Write-Host "4. 🌐 Open dashboards"
Write-Host "5. 📚 View troubleshooting"
Write-Host ""

$choice = Read-Host "Select option (1-5)"

if ($choice -eq "1") {
    Write-Host "📖 Opening setup guide..." -ForegroundColor Green
    if (Test-Path "RESEND_SMTP_SETUP_GUIDE.md") {
        Start-Process "RESEND_SMTP_SETUP_GUIDE.md"
        Write-Host "✅ Setup guide opened!" -ForegroundColor Green
    } else {
        Write-Host "❌ Setup guide not found" -ForegroundColor Red
    }
} elseif ($choice -eq "2") {
    Write-Host "🔧 Running automated setup..." -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 You'll need:" -ForegroundColor Yellow
    Write-Host "- Resend API key"
    Write-Host "- Supabase access token"
    Write-Host ""
    
    if (Test-Path "automated-smtp-setup.js") {
        & node automated-smtp-setup.js
    } else {
        Write-Host "❌ Setup script not found" -ForegroundColor Red
    }
} elseif ($choice -eq "3") {
    Write-Host "🧪 Testing email setup..." -ForegroundColor Green
    
    if (Test-Path "test-email-setup.js") {
        & node test-email-setup.js
    } else {
        Write-Host "❌ Test script not found" -ForegroundColor Red
    }
} elseif ($choice -eq "4") {
    Write-Host "🌐 Opening dashboards..." -ForegroundColor Green
    
    # Open Resend
    Start-Process "https://resend.com/signup"
    Start-Sleep 1
    
    # Open Supabase Auth
    Start-Process "https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/settings/auth"
    Start-Sleep 1
    
    # Open Rate Limits
    Start-Process "https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/auth/rate-limits"
    
    Write-Host "✅ Dashboards opened!" -ForegroundColor Green
} elseif ($choice -eq "5") {
    Write-Host "📚 Troubleshooting:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "• SMTP not configured - set up Resend first"
    Write-Host "• Auto-confirm enabled - disable in Supabase"
    Write-Host "• Rate limits too low - increase in dashboard"
    Write-Host ""
    Write-Host "Resources:"
    Write-Host "• Resend docs: https://resend.com/docs"
    Write-Host "• Supabase auth: https://supabase.com/docs/guides/auth"
} else {
    Write-Host "❌ Invalid option" -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 Quick links:" -ForegroundColor Cyan
Write-Host "• Resend: https://resend.com/dashboard"
Write-Host "• Supabase: https://supabase.com/dashboard/project/akynyenmqbgejtczgysv"
Write-Host ""
Write-Host "🎉 Done!" -ForegroundColor Green
Read-Host "Press Enter to exit" 