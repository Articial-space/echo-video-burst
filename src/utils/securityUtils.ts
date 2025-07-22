
// Security utility functions for input validation and sanitization

export const validateVideoUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  // Prevent data URLs and javascript URLs
  if (url.startsWith('data:') || url.startsWith('javascript:') || url.startsWith('vbscript:')) {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTPS for security (except localhost for development)
    if (urlObj.protocol !== 'https:' && !urlObj.hostname.includes('localhost')) {
      return false;
    }
    
    // Allow common video hosting domains
    const allowedDomains = [
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'dailymotion.com',
      'twitch.tv',
      'facebook.com',
      'instagram.com',
      'tiktok.com'
    ];
    
    // Check if domain is allowed
    const isAllowedDomain = allowedDomains.some(domain => 
      urlObj.hostname === domain || 
      urlObj.hostname.endsWith(`.${domain}`)
    );
    
    // Also allow direct video file URLs with stricter validation
    const hasVideoExtension = /\.(mp4|webm|ogg|avi|mov|wmv|flv|m4v)$/i.test(urlObj.pathname);
    
    // Prevent URLs with suspicious query parameters
    const suspiciousParams = ['javascript', 'script', 'eval', 'alert'];
    const queryString = urlObj.search.toLowerCase();
    const hasSuspiciousParams = suspiciousParams.some(param => queryString.includes(param));
    
    return (isAllowedDomain || hasVideoExtension) && !hasSuspiciousParams;
  } catch {
    return false;
  }
};

export const validateVideoFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-ms-wmv', // .wmv
    'video/x-flv', // .flv
    'video/mp2t' // .ts
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a valid video file.'
    };
  }
  
  // Check file size (100MB limit)
  const maxSize = 100 * 1024 * 1024; // 100MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Please upload a video smaller than 100MB.'
    };
  }
  
  // Additional file extension check
  const allowedExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.m4v'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: 'Invalid file extension. Please upload a valid video file.'
    };
  }
  
  return { isValid: true };
};

export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters and limit length
  return input
    .replace(/[<>'"&]/g, '') // Remove HTML/script injection characters
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .replace(/vbscript:/gi, '') // Remove vbscript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim()
    .substring(0, 500); // Limit length
};

export const sanitizeVideoTitle = (title: string): string => {
  if (!title || typeof title !== 'string') return '';
  
  // Enhanced sanitization for video titles
  return title
    .replace(/[<>'"&]/g, '') // Remove HTML/script injection characters
    .replace(/[\r\n\t]/g, ' ') // Replace line breaks and tabs with spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim()
    .substring(0, 200); // Shorter limit for titles
};

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email validation with additional security checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidFormat = emailRegex.test(email);
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i,
    /on\w+=/i
  ];
  
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(email));
  
  return isValidFormat && !hasSuspiciousContent && email.length <= 254;
};

export const clearSecureStorage = (keys: string[]): void => {
  keys.forEach(key => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};
