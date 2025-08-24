# Content Security Policy (CSP) Implementation

This document explains the Content Security Policy implementation for the Bible app and how to customize it for your needs.

## 🚀 What's Been Implemented

### 1. **CSP Configuration Files**
- `csp.config.js` - Main CSP configuration for development
- `csp.production.js` - Stricter CSP configuration for production
- `scripts/security/validate-csp.js` - CSP validation utility

### 2. **Security Headers Added**
- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Restricts camera, microphone, geolocation
- Strict-Transport-Security: Forces HTTPS

### 3. **Integration Points**
- Layout.astro - Meta tag CSP for static sites
- astro.config.mjs - Server-side CSP headers
- Vite configuration - Additional security headers

## 🔧 How to Customize CSP

### **Development vs Production**

The app uses different CSP configurations:

```javascript
// Development (csp.config.js)
'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"]

// Production (csp.production.js)  
'script-src': ["'self'", "'unsafe-inline'"]
```

### **Adding New Sources**

To allow additional sources, edit the appropriate config file:

```javascript
// Allow external analytics
'connect-src': [
  "'self'",
  "https://analytics.example.com"
]

// Allow external images
'img-src': [
  "'self'",
  "data:",
  "https:",
  "https://cdn.example.com"
]
```

### **Removing Security Risks**

For maximum security, you can remove unsafe directives:

```javascript
// Instead of 'unsafe-inline', use nonces
'script-src': [
  "'self'",
  "'nonce-${nonce}'"
]

// Instead of 'unsafe-eval', use trusted sources only
'script-src': [
  "'self'"
]
```

## 🧪 Testing Your CSP

### **Run the Validation Script**

```bash
node scripts/security/validate-csp.js
```

This will:
- Check for security issues
- Validate CSP syntax
- Provide security score
- Suggest improvements

### **Browser Testing**

1. Open Developer Tools
2. Go to Console tab
3. Look for CSP violation warnings
4. Check Network tab for blocked resources

### **Common CSP Violations**

```javascript
// These will be blocked by default:
eval('console.log("test")')           // unsafe-eval
<script>console.log("test")</script>  // unsafe-inline
<iframe src="https://example.com">    // frame-src: none
```

## 📱 CSP Directives Explained

### **Core Directives**

| Directive | Purpose | Example |
|-----------|---------|---------|
| `default-src` | Fallback for other directives | `'self'` |
| `script-src` | JavaScript sources | `'self' 'unsafe-inline'` |
| `style-src` | CSS sources | `'self' https://fonts.googleapis.com` |
| `font-src` | Font sources | `'self' https://fonts.gstatic.com` |
| `img-src` | Image sources | `'self' data: https:` |

### **Security Directives**

| Directive | Purpose | Security Level |
|-----------|---------|----------------|
| `frame-src` | Frame/iframe sources | `'none'` (High) |
| `object-src` | Plugin sources | `'none'` (High) |
| `base-uri` | Base tag restrictions | `'self'` (Medium) |
| `form-action` | Form submission targets | `'self'` (Medium) |

## 🚨 Troubleshooting

### **Common Issues**

1. **Styles not loading**
   ```javascript
   // Add to style-src
   'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"]
   ```

2. **Fonts not loading**
   ```javascript
   // Add to font-src
   'font-src': ["'self'", "https://fonts.gstatic.com"]
   ```

3. **Scripts not working**
   ```javascript
   // Check script-src includes necessary sources
   'script-src': ["'self'", "'unsafe-inline'"]
   ```

### **Debug Mode**

Enable CSP reporting to see violations:

```javascript
// Add to CSP config
'report-uri': '/csp-report'
'report-to': 'csp-endpoint'
```

## 🔒 Security Best Practices

### **1. Principle of Least Privilege**
- Start with restrictive policies
- Add sources only when necessary
- Remove unsafe directives in production

### **2. Regular Auditing**
- Run validation script monthly
- Monitor CSP violations in production
- Update policies based on new requirements

### **3. Testing Strategy**
- Test in staging environment first
- Use browser dev tools to check violations
- Validate with security tools (OWASP ZAP, etc.)

## 📚 Additional Resources

- [MDN CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

## 🎯 Next Steps

1. **Test your current CSP** with the validation script
2. **Customize policies** based on your specific needs
3. **Implement nonces/hashes** to remove unsafe-inline
4. **Set up CSP reporting** for production monitoring
5. **Regular security audits** of your CSP configuration

---

**Remember**: CSP is a powerful security tool, but it requires careful configuration and regular maintenance. Start conservative and gradually relax restrictions as needed.
