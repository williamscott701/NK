// Utility functions for handling paths with base URL
export const getPath = (path: string): string => {
  // Check if we're already on a page with /NK prefix to avoid duplication
  if (typeof window !== 'undefined') {
    // Client-side: check current path
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/NK')) {
      // Already on /NK page, don't add another /NK
      return path;
    }
    
    // Check if we're on GitHub Pages (legacy support)
    if (window.location.hostname.includes('github.io')) {
      const baseUrl = '/NK';
      return `${baseUrl}${path}`;
    }
  }
  
  // For custom domain and local development, don't add prefix
  return path;
};

// Common paths
export const PATHS = {
  books: () => getPath('/books'),
  concepts: () => getPath('/concepts'),
  stories: () => getPath('/stories'),
  book: (bookId: string) => getPath(`/book/${bookId}`),
  concept: (conceptId: string) => getPath(`/concept/${conceptId}`),
  story: (storyId: string) => getPath(`/story/${storyId}`),
  chapter: (bookId: string, chapterNumber: string) => getPath(`/book/${bookId}/chapter/${chapterNumber}`),
  home: () => getPath('/'),
  about: () => getPath('/about'),
  help: () => getPath('/help'),
  contact: () => getPath('/contact'),
  privacy: () => getPath('/privacy'),
  terms: () => getPath('/terms'),
};
