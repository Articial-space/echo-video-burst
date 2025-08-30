#!/usr/bin/env node

/**
 * Email Setup Test Script
 * Tests if your SMTP configuration is working properly
 * 
 * Usage: node test-email-setup.js
 */

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

const SUPABASE_URL = "https://akynyenmqbgejtczgysv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreW55ZW5tcWJnZWp0Y3pneXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNjUxNDksImV4cCI6MjA2Njc0MTE0OX0.yNdemYi01jtcRlg1FE4h2m7xlk0pqBDoYN4D4wNKPrc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function testEmailSetup() {
  console.log('🧪 Echo Video Burst - Email Setup Test\n');
  
  try {
    const testEmail = await question('📧 Enter your email address for testing: ');
    
    console.log('\n🔄 Testing signup email verification...');
    
    // Test signup with email verification
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        emailRedirectTo: `${SUPABASE_URL}/email-verification`
      }
    });
    
    if (error) {
      console.error('❌ Signup test failed:', error.message);
      
      // Common error scenarios
      if (error.message.includes('Email address not authorized')) {
        console.log('\n🔍 Issue: Using default SMTP (team members only)');
        console.log('✅ Solution: Set up custom SMTP as per the guide');
      } else if (error.message.includes('rate limit')) {
        console.log('\n🔍 Issue: Rate limit exceeded');
        console.log('✅ Solution: Wait or increase rate limits in dashboard');
      }
      
      return;
    }
    
    console.log('✅ Signup request successful!');
    console.log('📊 Test Results:');
    console.log(`User created: ${data.user ? 'Yes' : 'No'}`);
    console.log(`Session created: ${data.session ? 'Yes (auto-confirmed)' : 'No (verification required)'}`);
    console.log(`Email confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`);
    
    if (!data.session && data.user) {
      console.log('\n✅ Perfect! Email verification is required.');
      console.log('📧 Check your email inbox for the verification link.');
      console.log('📱 Don\'t forget to check spam folder too.');
    } else if (data.session) {
      console.log('\n⚠️  Warning: User was auto-confirmed.');
      console.log('🔧 This suggests SMTP might not be configured correctly.');
      console.log('💡 Check that "Auto-confirm users" is disabled in Supabase dashboard.');
    }
    
    // Test password reset
    console.log('\n🔄 Testing password reset email...');
    
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: `${SUPABASE_URL}/reset-password`,
    });
    
    if (resetError) {
      console.error('❌ Password reset test failed:', resetError.message);
    } else {
      console.log('✅ Password reset email requested successfully!');
      console.log('📧 Check your email for the reset link.');
    }
    
    // Cleanup test user
    console.log('\n🧹 Cleaning up test user...');
    if (data.user) {
      console.log(`Test user ID: ${data.user.id}`);
      console.log('💡 You may want to delete this test user from the Supabase dashboard.');
    }
    
    console.log('\n🎉 Email test completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Check your email inbox for verification and reset emails');
    console.log('2. Verify that emails arrive within 1-2 minutes');
    console.log('3. Test the email links work correctly');
    console.log('4. If emails don\'t arrive, check your SMTP configuration');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    console.log('\n🔍 Common Issues:');
    console.log('1. SMTP not configured - emails only go to team members');
    console.log('2. Rate limits exceeded - wait or increase limits');
    console.log('3. Auto-confirm enabled - disable in dashboard settings');
    console.log('4. Invalid API keys - double-check Supabase and Resend keys');
    
  } finally {
    rl.close();
  }
}

// Check current auth configuration
async function checkAuthConfig() {
  console.log('\n🔍 Checking current auth configuration...');
  
  try {
    // This would require admin access - showing conceptual check
    console.log('✅ Project URL:', SUPABASE_URL);
    console.log('✅ Anon Key available');
    
    console.log('\n📋 Manual checks needed:');
    console.log('1. Go to: https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/settings/auth');
    console.log('2. Verify SMTP settings are configured');
    console.log('3. Ensure "Auto-confirm users" is OFF');
    console.log('4. Check rate limits: https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/auth/rate-limits');
    
  } catch (error) {
    console.error('❌ Config check failed:', error.message);
  }
}

// Email delivery monitoring
function emailDeliveryTips() {
  console.log('\n📊 Email Delivery Monitoring Tips:');
  console.log('');
  console.log('🎯 Resend Dashboard (https://resend.com/dashboard):');
  console.log('  • View delivery status');
  console.log('  • Check bounce/complaint rates');
  console.log('  • Monitor sending volume');
  console.log('');
  console.log('🎯 Supabase Dashboard Logs:');
  console.log('  • Go to: Logs → Filter by "email" or "auth"');
  console.log('  • Look for send/delivery events');
  console.log('  • Debug any error messages');
  console.log('');
  console.log('🎯 Troubleshooting Checklist:');
  console.log('  ✅ API keys are correct');
  console.log('  ✅ SMTP host/port settings match');
  console.log('  ✅ Rate limits are appropriate');
  console.log('  ✅ Domain DNS records configured (if using custom domain)');
  console.log('  ✅ No auto-confirm enabled');
}

// Run the test
async function main() {
  await checkAuthConfig();
  await testEmailSetup();
  emailDeliveryTips();
}

main(); 