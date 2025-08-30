#!/usr/bin/env node

/**
 * Ghost User Cleanup Script
 * Removes leftover authentication records that don't have proper profiles
 * 
 * Usage: node cleanup-ghost-user.js
 */

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

const SUPABASE_URL = "https://akynyenmqbgejtczgysv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreW55ZW5tcWJnZWp0Y3pneXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNjUxNDksImV4cCI6MjA2Njc0MTE0OX0.yNdemYi01jtcRlg1FE4h2m7xlk0pqBDoYN4D4wNKPrc";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function cleanupGhostUser() {
  console.log('🧹 Echo Video Burst - Ghost User Cleanup\n');
  
  try {
    const email = await question('📧 Enter the email address to clean up: ');
    
    // Create admin client (requires service role key)
    const serviceRoleKey = await question('🔑 Enter your Supabase service role key (from project settings): ');
    
    const supabaseAdmin = createClient(SUPABASE_URL, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('\n🔍 Checking for ghost user records...');
    
    // Check if user exists in auth.users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('auth.users')
      .select('*')
      .eq('email', email);
    
    if (usersError) {
      console.error('❌ Error checking users:', usersError.message);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('✅ No ghost users found for this email.');
      return;
    }
    
    const user = users[0];
    console.log(`📋 Found user: ${user.email} (ID: ${user.id})`);
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking profile:', profileError.message);
      return;
    }
    
    if (profile) {
      console.log('⚠️  User has a valid profile. This might not be a ghost user.');
      const proceed = await question('Continue with deletion anyway? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('🚫 Cleanup cancelled.');
        return;
      }
    } else {
      console.log('👻 Confirmed: Ghost user detected (no profile record)');
    }
    
    // Delete the user using admin API
    console.log('\n🗑️  Deleting ghost user...');
    
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error('❌ Failed to delete user:', deleteError.message);
      return;
    }
    
    console.log('✅ Ghost user successfully deleted!');
    console.log('\n📋 What was cleaned up:');
    console.log('• Removed from auth.users table');
    console.log('• Removed from auth.identities table');
    console.log('• Cleared any active sessions');
    
    console.log('\n🎉 You can now sign up with this email again!');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    
    console.log('\n🔧 Alternative solutions:');
    console.log('1. Delete user manually in Supabase dashboard');
    console.log('2. Use a different email for testing');
    console.log('3. Contact support if issue persists');
    
  } finally {
    rl.close();
  }
}

// Check for ghost users (users without profiles)
async function findGhostUsers() {
  console.log('👻 Scanning for ghost users...\n');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // This query would need admin permissions
    console.log('📋 To find ghost users, run this query in Supabase SQL Editor:');
    console.log(`
-- Find users without profiles (ghost users)
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  i.provider,
  CASE WHEN p.id IS NULL THEN 'GHOST USER' ELSE 'Valid User' END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN auth.identities i ON u.id = i.user_id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;
    `);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run cleanup
async function main() {
  const action = await question('Choose action:\n1. 🧹 Clean up specific ghost user\n2. 👻 Find all ghost users\n\nSelect (1 or 2): ');
  
  if (action === '1') {
    await cleanupGhostUser();
  } else if (action === '2') {
    await findGhostUsers();
  } else {
    console.log('❌ Invalid option');
  }
}

main(); 