# Echo Video Burst - SMTP Setup Script
# PowerShell script for Windows users

Write-Host "🚀 Echo Video Burst - SMTP Setup Helper" -ForegroundColor Green
Write-Host ""

# Check Node.js availability
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Blue
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "📋 SMTP Setup Options:" -ForegroundColor Cyan
Write-Host "1. 📖 View setup guide"
Write-Host "2. 🔧 Run automated setup (requires Resend API key)"
Write-Host "3. 🧪 Test current email configuration"
Write-Host "4. 🌐 Open required dashboards"
Write-Host "5. 📚 View troubleshooting guide"
Write-Host ""

$choice = Read-Host "Select option (1-5)"

# Handle user choice
if ($choice -eq "1") {
    Write-Host "📖 Opening setup guide..." -ForegroundColor Green
    if (Test-Path ".\RESEND_SMTP_SETUP_GUIDE.md") {
        Start-Process ".\RESEND_SMTP_SETUP_GUIDE.md"
    } else {
        Write-Host "❌ Setup guide not found in current directory" -ForegroundColor Red
        Write-Host "Please ensure you're in the echo-video-burst directory" -ForegroundColor Yellow
    }
}
elseif ($choice -eq "2") {
    Write-Host "🔧 Running automated setup..." -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prerequisites:" -ForegroundColor Yellow
    Write-Host "1. Resend account created (https://resend.com/signup)"
    Write-Host "2. Resend API key obtained"
    Write-Host "3. Supabase access token (https://supabase.com/dashboard/account/tokens)"
    Write-Host ""
    
    $confirm = Read-Host "Do you have all prerequisites? (y/n)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        if (Test-Path ".\automated-smtp-setup.js") {
            & node .\automated-smtp-setup.js
        } else {
            Write-Host "❌ Automated setup script not found" -ForegroundColor Red
            Write-Host "Please ensure you're in the echo-video-burst directory" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Please complete the prerequisites first." -ForegroundColor Yellow
    }
}
elseif ($choice -eq "3") {
    Write-Host "🧪 Testing email configuration..." -ForegroundColor Green
    Write-Host ""
    Write-Host "This will test:"
    Write-Host "• Email verification flow"
    Write-Host "• Password reset emails"
    Write-Host "• SMTP configuration"
    Write-Host ""
    
    if (Test-Path ".\test-email-setup.js") {
        # Install dependencies if needed
        if (-not (Test-Path ".\node_modules\@supabase\supabase-js")) {
            Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
            & npm install @supabase/supabase-js
        }
        & node .\test-email-setup.js
    } else {
        Write-Host "❌ Test script not found" -ForegroundColor Red
        Write-Host "Please ensure you're in the echo-video-burst directory" -ForegroundColor Yellow
    }
}
elseif ($choice -eq "4") {
    Write-Host "🌐 Opening required dashboards..." -ForegroundColor Green
    
    # Open Resend signup
    Write-Host "Opening Resend signup..."
    Start-Process "https://resend.com/signup"
    
    Start-Sleep 2
    
    # Open Supabase auth settings
    Write-Host "Opening Supabase auth settings..."
    Start-Process "https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/settings/auth"
    
    Start-Sleep 2
    
    # Open Supabase rate limits
    Write-Host "Opening Supabase rate limits..."
    Start-Process "https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/auth/rate-limits"
    
    Write-Host "✅ All dashboards opened in your browser" -ForegroundColor Green
}
elseif ($choice -eq "5") {
    Write-Host "📚 Troubleshooting Guide:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔍 Common Issues:" -ForegroundColor Yellow
    Write-Host "1. Emails not sending:"
    Write-Host "   • Check SMTP credentials in Supabase dashboard"
    Write-Host "   • Verify Resend API key is valid"
    Write-Host "   • Ensure auto-confirm is disabled"
    Write-Host ""
    Write-Host "2. Emails going to spam:"
    Write-Host "   • Add domain to Resend"
    Write-Host "   • Configure SPF/DKIM records"
    Write-Host "   • Use consistent from address"
    Write-Host ""
    Write-Host "3. Rate limiting errors:"
    Write-Host "   • Increase limits in Supabase dashboard"
    Write-Host "   • Check Resend usage limits"
    Write-Host "   • Wait between attempts"
    Write-Host ""
    Write-Host "📞 Support Resources:" -ForegroundColor Yellow
    Write-Host "• Resend docs: https://resend.com/docs"
    Write-Host "• Supabase auth docs: https://supabase.com/docs/guides/auth"
    Write-Host "• Email rate limiting: /email-rate-limit-demo"
} else {
    Write-Host "❌ Invalid option selected" -ForegroundColor Red
    Write-Host "Please select a number between 1-5" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Quick Reference:" -ForegroundColor Cyan
Write-Host "• Resend Dashboard: https://resend.com/dashboard"
Write-Host "• Supabase Auth: https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/settings/auth"
Write-Host "• Test your app: npm run dev (run from echo-video-burst directory)"
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green

# Keep window open
Write-Host ""
Read-Host "Press Enter to exit" 