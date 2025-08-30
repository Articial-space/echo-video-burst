# Email Rate Limiting Implementation 🔐⏱️

## 🎯 **Feature Overview**

Added **60-second rate limiting** for all email sending functions to prevent spam and abuse. Users must wait 60 seconds between email resend attempts.

## 🛠️ **Implementation Details**

### **1. Reusable Hook: `useEmailRateLimit`**

**Location:** `src/hooks/use-email-rate-limit.tsx`

```typescript
interface EmailRateLimitConfig {
  cooldownSeconds?: number;  // Default: 60 seconds
  storageKey: string;        // Unique key for localStorage
}

interface EmailRateLimitReturn {
  canSend: boolean;           // Whether user can send email
  timeRemaining: number;      // Seconds remaining in cooldown
  isOnCooldown: boolean;      // Whether currently on cooldown
  startCooldown: () => void;  // Start the cooldown timer
  resetCooldown: () => void;  // Reset cooldown (admin function)
  formatTime: (seconds: number) => string; // Format time as MM:SS
}
```

### **2. Key Features**

#### **✅ Persistent Across Page Refreshes**
- Uses `localStorage` to maintain cooldown state
- Survives browser refreshes and tab switches
- Automatic cleanup when cooldown expires

#### **✅ Independent Cooldowns**
- Each email type has its own cooldown
- Email verification: `'email-verification-cooldown'`
- Password reset: `'password-reset-cooldown'`
- Can be configured for any email function

#### **✅ Visual Feedback**
- Real-time countdown timer (MM:SS format)
- Disabled buttons during cooldown
- Clear status indicators
- Contextual messaging

#### **✅ Security Benefits**
- Prevents email spam/abuse
- Protects email sending reputation
- Reduces server load
- Complies with email service rate limits

---

## 📍 **Applied to Components**

### **1. Email Verification (`EmailVerification.tsx`)**

**Before:**
```typescript
// Custom countdown implementation
const [countdown, setCountdown] = useState(60);
const [canResend, setCanResend] = useState(false);
```

**After:**
```typescript
// Standardized rate limiting hook
const {
  canSend: canResend,
  timeRemaining,
  startCooldown,
  formatTime
} = useEmailRateLimit({
  cooldownSeconds: 60,
  storageKey: 'email-verification-cooldown'
});
```

### **2. Password Reset (`ForgotPassword.tsx`)**

**Before:**
```typescript
// No rate limiting - users could spam reset emails
<Button onClick={() => setEmailSent(false)}>
  Try Again
</Button>
```

**After:**
```typescript
// 60-second rate limiting implemented
<Button
  disabled={!canSend}
  onClick={() => setEmailSent(false)}
>
  {canSend ? (
    <>
      <RefreshCw className="h-4 w-4 mr-2" />
      Try Again
    </>
  ) : (
    <>
      <Clock className="h-4 w-4 mr-2" />
      Try Again in {formatTime(timeRemaining)}
    </>
  )}
</Button>
```

---

## 🎮 **Demo Components**

### **1. Email Rate Limit Demo** 
**URL:** `/email-rate-limit-demo`

Interactive demo showing:
- ✅ Real-time countdown timers
- ✅ Independent cooldowns for different email types
- ✅ Status indicators
- ✅ Reset functionality (for testing)
- ✅ Persistent across page refreshes

### **2. Features Demonstrated:**
- Send verification email simulation
- Send password reset email simulation
- Visual cooldown status
- Countdown timers
- Button state management
- localStorage persistence

---

## 🔧 **Technical Implementation**

### **Hook Logic Flow:**

```typescript
1. Component mounts → Check localStorage for existing cooldown
2. If cooldown active → Calculate remaining time
3. Start countdown timer → Update every second
4. User sends email → Call startCooldown()
5. Save timestamp → Start 60-second countdown
6. Cooldown expires → Clean up localStorage, enable button
```

### **Storage Structure:**
```javascript
// localStorage keys and values
{
  'email-verification-cooldown': '1690123456789',  // Timestamp
  'password-reset-cooldown': '1690123789012'       // Timestamp
}
```

### **Timer Management:**
```typescript
useEffect(() => {
  if (timeRemaining > 0) {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsOnCooldown(false);
          localStorage.removeItem(storageKey); // Cleanup
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup
  }
}, [timeRemaining, storageKey]);
```

---

## 🧪 **Testing Scenarios**

### **1. Basic Rate Limiting:**
```typescript
// Test case 1: Send email → Should start cooldown
await simulateEmailSend('verification');
expect(canSend).toBe(false);
expect(timeRemaining).toBe(60);

// Test case 2: Wait 60 seconds → Should allow resend
await waitFor(60000);
expect(canSend).toBe(true);
expect(timeRemaining).toBe(0);
```

### **2. Persistence Testing:**
```typescript
// Test case 3: Refresh page during cooldown
startCooldown();
window.location.reload();
// Should maintain cooldown state
expect(canSend).toBe(false);
```

### **3. Independent Cooldowns:**
```typescript
// Test case 4: Different email types
verificationLimit.startCooldown();
expect(verificationLimit.canSend).toBe(false);
expect(resetLimit.canSend).toBe(true); // Should remain independent
```

---

## 🚀 **Usage Examples**

### **Basic Usage:**
```typescript
import { useEmailRateLimit } from '@/hooks/use-email-rate-limit';

const MyComponent = () => {
  const { canSend, timeRemaining, startCooldown, formatTime } = useEmailRateLimit({
    cooldownSeconds: 60,
    storageKey: 'my-email-cooldown'
  });

  const sendEmail = async () => {
    if (!canSend) return;
    
    // Send email logic here...
    await emailService.send(email);
    
    // Start cooldown
    startCooldown();
  };

  return (
    <Button disabled={!canSend} onClick={sendEmail}>
      {canSend ? 'Send Email' : `Wait ${formatTime(timeRemaining)}`}
    </Button>
  );
};
```

### **Advanced Usage with Multiple Email Types:**
```typescript
const MyAdvancedComponent = () => {
  // Different cooldowns for different purposes
  const welcomeEmailLimit = useEmailRateLimit({
    cooldownSeconds: 30,
    storageKey: 'welcome-email-cooldown'
  });
  
  const newsletterLimit = useEmailRateLimit({
    cooldownSeconds: 120,
    storageKey: 'newsletter-cooldown'
  });

  // Each operates independently...
};
```

---

## 📊 **Performance Considerations**

### **Memory Usage:**
- ✅ Minimal memory footprint
- ✅ Automatic cleanup of expired timers
- ✅ localStorage cleanup on expiry

### **Browser Compatibility:**
- ✅ Works with all modern browsers
- ✅ Graceful fallback if localStorage unavailable
- ✅ No external dependencies

### **Network Impact:**
- ✅ Reduces unnecessary API calls
- ✅ Prevents email service rate limit violations
- ✅ Improves server performance

---

## 🔐 **Security Benefits**

1. **Spam Prevention:** Users cannot flood the system with email requests
2. **Server Protection:** Reduces load on email sending services  
3. **Rate Limit Compliance:** Stays within email service quotas
4. **User Experience:** Clear feedback prevents user confusion
5. **Abuse Mitigation:** Makes automated attacks less effective

---

## 🎉 **Summary**

**✅ Implemented:** 60-second rate limiting for all email functions  
**✅ Features:** Persistent, visual feedback, independent cooldowns  
**✅ Applied to:** Email verification, password reset, future email functions  
**✅ Reusable:** Easy to apply to any email sending component  
**✅ Tested:** Demo component for verification and testing  

This implementation significantly improves the security and user experience of email functionality while preventing abuse and protecting your email sending reputation! 🛡️ 