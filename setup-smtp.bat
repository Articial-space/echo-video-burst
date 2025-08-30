@echo off
title Echo Video Burst - SMTP Setup
color 0A
echo.
echo ===============================================
echo   🚀 Echo Video Burst - SMTP Setup Helper  
echo ===============================================
echo.

REM Check Node.js
echo 🔍 Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set nodeVersion=%%i
    echo ✅ Node.js found: %nodeVersion%
)

echo.
echo 📋 SMTP Setup Options:
echo 1. 📖 View setup guide
echo 2. 🔧 Run automated setup
echo 3. 🧪 Test email configuration  
echo 4. 🌐 Open dashboards
echo 5. 📚 View troubleshooting
echo.

set /p choice="Select option (1-5): "

if "%choice%"=="1" (
    echo.
    echo 📖 Opening setup guide...
    if exist "RESEND_SMTP_SETUP_GUIDE.md" (
        start "" "RESEND_SMTP_SETUP_GUIDE.md"
        echo ✅ Setup guide opened!
    ) else (
        echo ❌ Setup guide not found
    )
) else if "%choice%"=="2" (
    echo.
    echo 🔧 Running automated setup...
    echo.
    echo 📋 You'll need:
    echo - Resend API key ^(from https://resend.com/api-keys^)
    echo - Supabase access token ^(from https://supabase.com/dashboard/account/tokens^)
    echo.
    if exist "automated-smtp-setup.js" (
        node automated-smtp-setup.js
    ) else (
        echo ❌ Setup script not found
    )
) else if "%choice%"=="3" (
    echo.
    echo 🧪 Testing email setup...
    if exist "test-email-setup.js" (
        node test-email-setup.js
    ) else (
        echo ❌ Test script not found
    )
) else if "%choice%"=="4" (
    echo.
    echo 🌐 Opening dashboards...
    echo Opening Resend signup...
    start "" "https://resend.com/signup"
    timeout /t 2 >nul
    echo Opening Supabase auth settings...
    start "" "https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/settings/auth"
    timeout /t 2 >nul
    echo Opening Supabase rate limits...
    start "" "https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/auth/rate-limits"
    echo ✅ All dashboards opened!
) else if "%choice%"=="5" (
    echo.
    echo 📚 Troubleshooting Guide:
    echo.
    echo Common Issues:
    echo • SMTP not configured - Set up Resend first
    echo • Auto-confirm enabled - Disable in Supabase dashboard
    echo • Rate limits too low - Increase in dashboard
    echo • Emails going to spam - Add domain to Resend
    echo.
    echo Resources:
    echo • Resend docs: https://resend.com/docs
    echo • Supabase auth: https://supabase.com/docs/guides/auth
    echo • Your project: https://supabase.com/dashboard/project/akynyenmqbgejtczgysv
) else (
    echo ❌ Invalid option selected
)

echo.
echo 💡 Quick Reference:
echo • Resend Dashboard: https://resend.com/dashboard
echo • Supabase Auth: https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/settings/auth
echo • Test your app: npm run dev
echo.
echo 🎉 Setup complete!
echo.
pause 