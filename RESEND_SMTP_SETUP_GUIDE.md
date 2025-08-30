# Resend SMTP Setup Guide 📧✨

## 🎯 **Quick Setup Overview**

We're setting up **Resend** as your custom SMTP service to fix the email verification issues and enable proper email delivery for your Echo Video Burst application.

## 📋 **What You'll Need**

- ✅ Resend account (free tier: 3,000 emails/month)
- ✅ API key from Resend
- ✅ Access to your Supabase dashboard
- ✅ 5-10 minutes for setup

---

## 🔥 **Step 1: Create Resend Account**

### **1.1 Sign Up for Resend**
1. **Visit:** https://resend.com/signup
2. **Sign up** with your email address
3. **Verify your email** when prompted
4. **Complete onboarding** process

### **1.2 Domain Setup (Recommended)**
For best deliverability, add your domain:

1. **Go to:** Resend Dashboard → Domains
2. **Click:** "Add Domain"
3. **Enter your domain:** (e.g., `yourdomain.com`)
4. **Add DNS records** as instructed by Resend
5. **Verify domain** once DNS propagates

**💡 For testing:** You can skip domain setup and use the default `@resend.dev` from address.

---

## 🔑 **Step 2: Get Your API Key**

### **2.1 Create API Key**
1. **Go to:** Resend Dashboard → [API Keys](https://resend.com/api-keys)
2. **Click:** "Create API Key"
3. **Name:** `Echo Video Burst Auth Emails`
4. **Permission:** `Sending access` (default)
5. **Domain:** Select your domain or leave as "All Domains"
6. **Click:** "Add"

### **2.2 Copy Your API Key**
```bash
# Your API key will look like this:
re_AbCdEfGh_1234567890abcdefghijklmnopqrs
```
**⚠️ Important:** Copy this key immediately - you won't be able to see it again!

---

## ⚙️ **Step 3: Configure Supabase Dashboard**

### **3.1 Access Authentication Settings**
1. **Go to:** [Supabase Dashboard](https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/settings/auth)
2. **Navigate to:** Authentication → Settings
3. **Scroll down to:** "SMTP Settings" section

### **3.2 Configure SMTP Settings**
Fill in these exact values:

```
✅ Enable custom SMTP server: ON

Host: smtp.resend.com
Port: 587
Username: resend
Password: re_AbCdEfGh_1234567890abcdefghijklmnopqrs (your API key)

Sender email: noreply@yourdomain.com (or noreply@resend.dev for testing)
Sender name: Echo Video Burst

Enable TLS: ON (checked)
```

### **3.3 Additional Settings**
```
✅ Enable email confirmations: ON
❌ Auto-confirm users: OFF (critical!)
✅ Secure email change: ON
```

### **3.4 Save Configuration**
Click **"Save"** to apply the settings.

---

## 📈 **Step 4: Update Rate Limits**

### **4.1 Increase Email Rate Limits**
1. **Go to:** [Auth Rate Limits](https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/auth/rate-limits)
2. **Update these settings:**
   ```
   Emails per hour: 100 (up from 30)
   Email confirmation requests: 10 per hour
   Password reset requests: 10 per hour
   ```
3. **Save changes**

---

## 🧪 **Step 5: Test Your Setup**

### **5.1 Test Email Verification**
1. **Visit:** Your app signup page
2. **Create account** with a real email address
3. **Expected result:**
   - ✅ Account created successfully
   - ✅ Verification email sent to inbox
   - ✅ Email arrives within 1-2 minutes
   - ✅ Email comes from your configured sender

### **5.2 Test Password Reset**
1. **Visit:** `/forgot-password` page
2. **Enter email** and submit
3. **Expected result:**
   - ✅ Reset email sent
   - ✅ Email arrives quickly
   - ✅ Reset link works properly

### **5.3 Test Rate Limiting**
1. **Visit:** `/email-rate-limit-demo` 
2. **Test sending** multiple emails
3. **Expected result:**
   - ✅ First email sends immediately
   - ✅ Second attempt shows 60-second countdown
   - ✅ Countdown persists across page refreshes

---

## 📧 **Example Email Configuration**

### **For Production (with custom domain):**
```
Host: smtp.resend.com
Port: 587
Username: resend
Password: re_YourActualAPIKey
Sender email: noreply@yourdomain.com
Sender name: Echo Video Burst
```

### **For Testing (without custom domain):**
```
Host: smtp.resend.com
Port: 587
Username: resend
Password: re_YourActualAPIKey
Sender email: onboarding@resend.dev
Sender name: Echo Video Burst
```

---

## 🔍 **Troubleshooting**

### **Problem: Emails not sending**
**Solution:**
1. Check API key is correct in Supabase settings
2. Verify Resend account is active
3. Check Supabase logs: Dashboard → Logs → Filter: "email"

### **Problem: Emails going to spam**
**Solution:**
1. Add your domain to Resend
2. Configure SPF/DKIM records
3. Use consistent "From" address

### **Problem: Rate limiting errors**
**Solution:**
1. Increase rate limits in Supabase dashboard
2. Check Resend usage limits
3. Verify your Resend plan supports your volume

### **Problem: Authentication template issues**
**Solution:**
1. Go to: Authentication → Email Templates
2. Ensure templates are properly configured
3. Test with simple template first

---

## 📊 **Monitoring & Analytics**

### **Resend Dashboard:**
- View email delivery status
- Check bounce rates
- Monitor sending volume
- Review delivery analytics

### **Supabase Logs:**
- Monitor auth email events
- Debug delivery issues
- Track rate limiting

---

## 🚀 **Production Recommendations**

### **Security:**
1. ✅ Use custom domain for professional appearance
2. ✅ Configure DKIM/SPF records for better deliverability
3. ✅ Monitor bounce rates and sender reputation
4. ✅ Set up webhook notifications for delivery events

### **Scaling:**
1. ✅ Monitor Resend usage limits
2. ✅ Set up billing alerts
3. ✅ Consider upgrading Resend plan if needed
4. ✅ Implement proper error handling and fallbacks

### **Maintenance:**
1. ✅ Regularly review email templates
2. ✅ Monitor delivery rates
3. ✅ Keep API keys secure and rotated
4. ✅ Test email flows after any changes

---

## 🎉 **Expected Results After Setup**

✅ **Email verification works** for all new signups  
✅ **Password reset emails** deliver reliably  
✅ **No more auto-confirmation** of unverified emails  
✅ **Professional email appearance** with custom domain  
✅ **Better deliverability** compared to default SMTP  
✅ **Detailed analytics** on email performance  

---

## 💡 **Quick Reference**

### **Resend SMTP Settings:**
```
Host: smtp.resend.com
Port: 587
Username: resend
Password: [Your Resend API Key]
```

### **Dashboard URLs:**
- **Resend Dashboard:** https://resend.com/dashboard
- **Supabase Auth Settings:** https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/settings/auth
- **Rate Limits:** https://supabase.com/dashboard/project/akynyenmqbgejtczgysv/auth/rate-limits

This setup will completely resolve your email verification issues and provide a robust, scalable email solution! 🚀 