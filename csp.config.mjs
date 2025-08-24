/**
 * Content Security Policy Configuration
 * This file contains all CSP directives for the Bible app
 */

const cspConfig = {
  // Default source restrictions
  'default-src': ["'self'"],
  
  // Script sources - allows inline scripts and eval for React hydration
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for React hydration
    "'unsafe-eval'"    // Required for React development
  ],
  
  // Style sources - allows inline styles and Google Fonts
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind CSS
    "https://fonts.googleapis.com"
  ],
  
  // Font sources - allows Google Fonts
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  
  // Image sources - allows self, data URIs, and HTTPS images
  'img-src': [
    "'self'",
    "data:",
    "https:"
  ],
  
  // Connect sources - for API calls and WebSocket connections
  'connect-src': [
    "'self'"
  ],
  
  // Frame sources - blocks all frames for security
  'frame-src': ["'none'"],
  
  // Object sources - blocks plugins and objects
  'object-src': ["'none'"],
  
  // Base URI - restricts base tag to same origin
  'base-uri': ["'self'"],
  
  // Form actions - restricts form submissions to same origin
  'form-action': ["'self'"],
  
  // Upgrade insecure requests - forces HTTPS
  'upgrade-insecure-requests': [],
  
  // Worker sources - allows service workers
  'worker-src': ["'self'"],
  
  // Manifest sources - allows web app manifest
  'manifest-src': ["'self'"]
};

// Convert config to CSP string
function generateCSP() {
  return Object.entries(cspConfig)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

// Additional security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

export {
  cspConfig,
  generateCSP,
  securityHeaders
};
