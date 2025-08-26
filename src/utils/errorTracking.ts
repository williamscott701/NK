/**
 * Error Tracking and Analytics Utility
 * Handles error logging, 404 tracking, and analytics
 */

export interface ErrorInfo {
  type: '404' | '500' | 'javascript' | 'network' | 'other';
  message: string;
  url: string;
  timestamp: number;
  userAgent: string;
  referrer: string;
  stack?: string;
}

export interface PageError {
  url: string;
  error: string;
  timestamp: number;
  userAgent: string;
  referrer: string;
}

class ErrorTracker {
  private errors: ErrorInfo[] = [];
  private maxErrors = 100; // Keep last 100 errors in memory

  /**
   * Track a 404 error
   */
  track404(url: string, referrer: string = '') {
    const error: ErrorInfo = {
      type: '404',
      message: 'Page not found',
      url,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer
    };

    this.addError(error);
    this.logToConsole(error);
    this.sendToAnalytics(error);
  }

  /**
   * Track a JavaScript error
   */
  trackJavaScriptError(error: Error, url: string, referrer: string = '') {
    const errorInfo: ErrorInfo = {
      type: 'javascript',
      message: error.message,
      url,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer,
      stack: error.stack
    };

    this.addError(errorInfo);
    this.logToConsole(errorInfo);
    this.sendToAnalytics(errorInfo);
  }

  /**
   * Track a network error
   */
  trackNetworkError(url: string, status: number, referrer: string = '') {
    const error: ErrorInfo = {
      type: 'network',
      message: `HTTP ${status}`,
      url,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer
    };

    this.addError(error);
    this.logToConsole(error);
    this.sendToAnalytics(error);
  }

  /**
   * Track any other type of error
   */
  trackError(type: string, message: string, url: string, referrer: string = '') {
    const error: ErrorInfo = {
      type: 'other',
      message,
      url,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer
    };

    this.addError(error);
    this.logToConsole(error);
    this.sendToAnalytics(error);
  }

  /**
   * Get all tracked errors
   */
  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  /**
   * Get errors by type
   */
  getErrorsByType(type: ErrorInfo['type']): ErrorInfo[] {
    return this.errors.filter(error => error.type === type);
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Export errors for debugging
   */
  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  private addError(error: ErrorInfo): void {
    this.errors.unshift(error);
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
  }

  private logToConsole(error: ErrorInfo): void {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Tracked: ${error.type.toUpperCase()}`);
      console.log('Message:', error.message);
      console.log('URL:', error.url);
      console.log('Timestamp:', new Date(error.timestamp).toISOString());
      console.log('Referrer:', error.referrer);
      if (error.stack) {
        console.log('Stack:', error.stack);
      }
      console.groupEnd();
    }
  }

  private sendToAnalytics(error: ErrorInfo): void {
    // In production, you would send this to your analytics service
    // Example: Google Analytics, Mixpanel, or custom endpoint
    
    try {
      // Google Analytics 4
      // Note: gtag analytics integration would be added here if needed

      // Google Analytics Universal
      // Note: ga analytics integration would be added here if needed

      // Custom analytics endpoint
      this.sendToCustomEndpoint(error);
      
    } catch (e) {
      // Silently fail if analytics services are not available
      console.warn('Failed to send error to analytics:', e);
    }
  }

  private async sendToCustomEndpoint(error: ErrorInfo): Promise<void> {
    try {
      // Replace with your actual error tracking endpoint
      const endpoint = '/api/errors';
      
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    } catch (e) {
      // Silently fail if endpoint is not available
      console.warn('Failed to send error to custom endpoint:', e);
    }
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

// Global error handlers
export function setupGlobalErrorHandling(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.trackError(
      'javascript',
      `Unhandled Promise Rejection: ${event.reason}`,
      window.location.href,
      document.referrer
    );
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    errorTracker.trackJavaScriptError(
      new Error(event.message),
      event.filename || window.location.href,
      document.referrer
    );
  });

  // Handle 404 errors (for SPA navigation)
  if (typeof window !== 'undefined') {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      // Check if the new URL exists, if not, track as potential 404
      setTimeout(() => checkPageExists(window.location.pathname), 100);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      setTimeout(() => checkPageExists(window.location.pathname), 100);
    };
  }
}

// Check if a page exists (basic implementation)
async function checkPageExists(pathname: string): Promise<void> {
  try {
    const response = await fetch(pathname, { method: 'HEAD' });
    if (response.status === 404) {
      errorTracker.track404(pathname, document.referrer);
    }
  } catch (e) {
    // Ignore network errors for this check
  }
}

// Export default instance
export default errorTracker;
