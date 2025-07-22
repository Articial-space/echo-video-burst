// Security headers and configurations for enhanced client-side protection

export const initSecurityHeaders = (): void => {
  // Set security-focused meta tags if they don't exist
  const setMetaTag = (name: string, content: string) => {
    if (!document.querySelector(`meta[name="${name}"]`)) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  };

  // Content Security Policy (basic client-side indication)
  setMetaTag('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://akynyenmqbgejtczgysv.supabase.co wss://akynyenmqbgejtczgysv.supabase.co; " +
    "frame-src 'self' https://accounts.google.com;"
  );

  // X-Content-Type-Options
  setMetaTag('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  setMetaTag('X-Frame-Options', 'DENY');

  // Referrer Policy
  setMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  setMetaTag('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()'
  );
};

export const validateOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    window.location.origin,
    'https://akynyenmqbgejtczgysv.supabase.co',
    // Add your production domain here when deploying
  ];
  
  return allowedOrigins.includes(origin);
};

export const preventClickjacking = (): void => {
  // Prevent clickjacking attacks
  if (window.top !== window.self) {
    // If we're in an iframe and it's not from an allowed origin
    try {
      const parentOrigin = document.referrer ? new URL(document.referrer).origin : '';
      if (!validateOrigin(parentOrigin)) {
        window.top!.location = window.self.location;
      }
    } catch {
      // If we can't access parent, assume it's malicious
      window.top!.location = window.self.location;
    }
  }
};

export const setupSecurityEventListeners = (): void => {
  // Monitor for suspicious activity
  let suspiciousActivityCount = 0;
  
  // Monitor for rapid form submissions (potential bot activity)
  const formSubmissionTimes: number[] = [];
  document.addEventListener('submit', () => {
    const now = Date.now();
    formSubmissionTimes.push(now);
    
    // Keep only submissions from last 10 seconds
    const recent = formSubmissionTimes.filter(time => now - time < 10000);
    
    if (recent.length > 5) {
      suspiciousActivityCount++;
      console.warn('Suspicious: Rapid form submissions detected');
    }
  });

  // Monitor for console manipulation attempts
  const originalConsole = console.log;
  console.log = function(...args) {
    const message = args.join(' ');
    if (message.includes('password') || message.includes('token') || message.includes('auth')) {
      console.warn('Potential security issue: Sensitive data in console');
    }
    originalConsole.apply(console, args);
  };

  // Monitor for DevTools opening (basic detection)
  let devtools = {
    open: false,
    orientation: null as string | null
  };
  
  const threshold = 160;
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        console.warn('DevTools opened - monitor for malicious activity');
      }
    } else {
      devtools.open = false;
    }
  }, 500);
};
