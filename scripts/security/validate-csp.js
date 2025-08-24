#!/usr/bin/env node

/**
 * CSP Validation and Testing Utility
 * Run this script to validate your CSP configuration
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load CSP configurations
function loadCSPConfig() {
  try {
    const cspPath = join(__dirname, '../../csp.config.js');
    const cspConfig = readFileSync(cspPath, 'utf8');
    
    // Extract CSP directives using regex
    const directives = {};
    const directiveRegex = /'([^']+)':\s*\[([^\]]+)\]/g;
    let match;
    
    while ((match = directiveRegex.exec(cspConfig)) !== null) {
      const directive = match[1];
      const sources = match[2]
        .split(',')
        .map(s => s.trim().replace(/'/g, ''))
        .filter(s => s.length > 0);
      directives[directive] = sources;
    }
    
    return directives;
  } catch (error) {
    console.error('Error loading CSP config:', error.message);
    return {};
  }
}

// Validate CSP configuration
function validateCSP(directives) {
  const issues = [];
  const warnings = [];
  
  console.log('🔒 Validating Content Security Policy Configuration...\n');
  
  // Check for required directives
  const requiredDirectives = ['default-src', 'script-src', 'style-src'];
  requiredDirectives.forEach(directive => {
    if (!directives[directive]) {
      issues.push(`Missing required directive: ${directive}`);
    }
  });
  
  // Check for security risks
  Object.entries(directives).forEach(([directive, sources]) => {
    if (sources.includes("'unsafe-eval'")) {
      warnings.push(`${directive}: 'unsafe-eval' is a security risk - consider removing in production`);
    }
    
    if (sources.includes("'unsafe-inline'")) {
      warnings.push(`${directive}: 'unsafe-inline' is a security risk - consider using nonces or hashes`);
    }
    
    if (sources.includes('*')) {
      issues.push(`${directive}: Wildcard (*) source is a security risk`);
    }
  });
  
  // Check for missing security directives
  const securityDirectives = ['frame-src', 'object-src', 'base-uri'];
  securityDirectives.forEach(directive => {
    if (!directives[directive]) {
      warnings.push(`Consider adding: ${directive} for enhanced security`);
    }
  });
  
  return { issues, warnings };
}

// Generate CSP report
function generateReport(directives, validation) {
  console.log('📋 CSP Configuration Report\n');
  console.log('Directives:');
  Object.entries(directives).forEach(([directive, sources]) => {
    console.log(`  ${directive}: ${sources.join(' ')}`);
  });
  
  console.log('\n🔍 Validation Results:');
  
  if (validation.issues.length === 0) {
    console.log('✅ No critical issues found');
  } else {
    console.log('❌ Critical Issues:');
    validation.issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  if (validation.warnings.length === 0) {
    console.log('✅ No warnings');
  } else {
    console.log('⚠️  Warnings:');
    validation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log('\n📊 Security Score:');
  const score = Math.max(0, 100 - (validation.issues.length * 25) - (validation.warnings.length * 10));
  console.log(`  ${score}/100`);
  
  if (score >= 90) {
    console.log('  🎉 Excellent security configuration!');
  } else if (score >= 70) {
    console.log('  👍 Good security configuration with room for improvement');
  } else if (score >= 50) {
    console.log('  ⚠️  Moderate security configuration - needs attention');
  } else {
    console.log('  🚨 Poor security configuration - immediate action required');
  }
}

// Test CSP with common scenarios
function testCSPScenarios() {
  console.log('\n🧪 Testing Common CSP Scenarios:\n');
  
  const scenarios = [
    {
      name: 'Inline Scripts',
      test: "console.log('test')",
      risk: 'Medium',
      recommendation: 'Use nonces or hashes instead of unsafe-inline'
    },
    {
      name: 'External Scripts',
      test: 'https://cdn.example.com/script.js',
      risk: 'High',
      recommendation: 'Only allow trusted sources'
    },
    {
      name: 'Inline Styles',
      test: '<style>body{color:red}</style>',
      risk: 'Medium',
      recommendation: 'Use nonces or hashes'
    },
    {
      name: 'Frames',
      test: '<iframe src="https://example.com"></iframe>',
      risk: 'High',
      recommendation: 'Set frame-src to none or trusted sources only'
    }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`  ${scenario.name}:`);
    console.log(`    Risk: ${scenario.risk}`);
    console.log(`    Recommendation: ${scenario.recommendation}\n`);
  });
}

// Main execution
function main() {
  try {
    const directives = loadCSPConfig();
    const validation = validateCSP(directives);
    
    generateReport(directives, validation);
    testCSPScenarios();
    
    console.log('\n🔗 Next Steps:');
    console.log('  1. Review and address any issues above');
    console.log('  2. Test your CSP in a staging environment');
    console.log('  3. Use browser dev tools to check for CSP violations');
    console.log('  4. Monitor CSP reports in production');
    
  } catch (error) {
    console.error('❌ Error running CSP validation:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { loadCSPConfig, validateCSP, generateReport };
