import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { generateCSP, securityHeaders } from './csp.config.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    mdx()
  ],
  output: 'static',
  site: 'https://w0p03c5.github.io',
  server: {
    port: 8080,
    host: true,
    headers: {
      // Content Security Policy
      'Content-Security-Policy': generateCSP(),
      
      // Additional Security Headers
      ...securityHeaders
    }
  },
  
  // Build optimizations for production
  build: {
    inlineStylesheets: 'auto'
  },
  
  // Vite configuration for additional security
  vite: {
    server: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    }
  }
});
