
// Security utility functions for input validation and sanitization

export const validateVideoUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    
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
    
    // Also allow direct video file URLs
    const hasVideoExtension = /\.(mp4|webm|ogg|avi|mov|wmv|flv|m4v)$/i.test(urlObj.pathname);
    
    return isAllowedDomain || hasVideoExtension;
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
    .trim()
    .substring(0, 500); // Limit length
};

export const clearSecureStorage = (keys: string[]): void => {
  keys.forEach(key => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};
