#!/usr/bin/env node

/**
 * Automated SMTP Setup Script for Supabase
 * This script configures Resend SMTP for your Echo Video Burst application
 * 
 * Prerequisites:
 * 1. Resend account with API key
 * 2. Supabase access token (get from: https://supabase.com/dashboard/account/tokens)
 * 
 * Usage:
 * node automated-smtp-setup.js
 */

import readline from 'readline';

const PROJECT_REF = "akynyenmqbgejtczgysv";

// Configuration prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function configureSmtp() {
  console.log('🚀 Echo Video Burst - Automated SMTP Setup\n');
  
  try {
    // Get user inputs
    const accessToken = await question('📝 Enter your Supabase Access Token (from https://supabase.com/dashboard/account/tokens): ');
    const resendApiKey = await question('🔑 Enter your Resend API Key (starts with re_): ');
    const senderEmail = await question('📧 Enter sender email (e.g., noreply@yourdomain.com or onboarding@resend.dev): ');
    const senderName = await question('👤 Enter sender name (e.g., Echo Video Burst): ');
    
    console.log('\n🔧 Configuring SMTP...');
    
    // SMTP Configuration
    const config = {
      external_email_enabled: true,
      mailer_secure_email_change_enabled: true,
      mailer_autoconfirm: false, // Critical: Disable auto-confirm
      smtp_admin_email: senderEmail,
      smtp_host: "smtp.resend.com",
      smtp_port: 587,
      smtp_user: "resend",
      smtp_pass: resendApiKey,
      smtp_sender_name: senderName
    };
    
    // Configure SMTP via Management API
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }
    
    const result = await response.json();
    console.log('✅ SMTP Configuration Applied Successfully!');
    
    // Update Rate Limits
    console.log('\n📈 Updating rate limits...');
    
    const rateLimitConfig = {
      email_confirm_rate_limit: 3600, // 1 hour
      email_otp_rate_limit: 3600,     // 1 hour  
      sms_otp_rate_limit: 3600,       // 1 hour
      email_change_confirm_rate_limit: 3600 // 1 hour
    };
    
    // Note: Rate limit configuration might need a different API endpoint
    // For now, user should update manually in dashboard
    
    console.log('\n🎉 Setup Complete! Next Steps:');
    console.log('1. ✅ SMTP configured with Resend');
    console.log('2. 📈 Update rate limits manually in dashboard:');
    console.log('   👉 https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/auth/rate-limits');
    console.log('   👉 Set "Emails per hour" to 100+');
    console.log('3. 🧪 Test your setup:');
    console.log('   👉 Visit your app and try signing up');
    console.log('   👉 Check for verification emails in inbox');
    
    console.log('\n📊 Configuration Summary:');
    console.log(`Project: ${PROJECT_REF}`);
    console.log(`SMTP Host: smtp.resend.com`);
    console.log(`Sender: ${senderName} <${senderEmail}>`);
    console.log(`Auto-confirm: DISABLED ✅`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Verify your Supabase access token is valid');
    console.log('2. Check your Resend API key is correct');
    console.log('3. Ensure you have admin access to the Supabase project');
    console.log('4. Try the manual setup method instead');
  } finally {
    rl.close();
  }
}

// Validation helper
function validateInputs(accessToken, resendApiKey, senderEmail) {
  const errors = [];
  
  if (!accessToken || accessToken.length < 20) {
    errors.push('Invalid Supabase access token');
  }
  
  if (!resendApiKey || !resendApiKey.startsWith('re_')) {
    errors.push('Invalid Resend API key (should start with re_)');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(senderEmail)) {
    errors.push('Invalid sender email format');
  }
  
  return errors;
}

// Test configuration
async function testSmtpSetup() {
  console.log('\n🧪 Testing SMTP Configuration...');
  
  // This would require implementing a test endpoint or using the Supabase client
  console.log('Manual test steps:');
  console.log('1. Go to your app signup page');
  console.log('2. Create a new account with your email');
  console.log('3. Check for verification email in inbox');
  console.log('4. Verify the email arrives within 1-2 minutes');
}

// Run the setup
configureSmtp(); 