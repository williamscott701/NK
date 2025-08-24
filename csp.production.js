/**
 * Production Content Security Policy Configuration
 * More restrictive than development for enhanced security
 */

const productionCSP = {
  // Default source restrictions - very restrictive
  'default-src': ["'self'"],
  
  // Script sources - more restrictive in production
  'script-src': [
    "'self'",
    "'unsafe-inline'" // Still needed for React hydration
    // Removed 'unsafe-eval' for production
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
  
  // Image sources - more restrictive
  'img-src': [
    "'self'",
    "data:",
    "https:"
  ],
  
  // Connect sources - very restrictive
  'connect-src': [
    "'self'"
  ],
  
  // Frame sources - blocks all frames
  'frame-src': ["'none'"],
  
  // Object sources - blocks all objects
  'object-src': ["'none'"],
  
  // Base URI - restricts base tag
  'base-uri': ["'self'"],
  
  // Form actions - restricts form submissions
  'form-action': ["'self'"],
  
  // Upgrade insecure requests - forces HTTPS
  'upgrade-insecure-requests': [],
  
  // Worker sources - allows service workers
  'worker-src': ["'self'"],
  
  // Manifest sources - allows web app manifest
  'manifest-src': ["'self'"],
  
  // Additional production restrictions
  'media-src': ["'self'"],
  'child-src': ["'none'"],
  'frame-ancestors': ["'none'"]
};

// Production security headers
const productionSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

// Convert config to CSP string
function generateProductionCSP() {
  return Object.entries(productionCSP)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

module.exports = {
  productionCSP,
  generateProductionCSP,
  productionSecurityHeaders
};
