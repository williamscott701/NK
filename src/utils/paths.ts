// Utility functions for handling paths with base URL
export const getPath = (path: string): string => {
  // For GitHub Pages deployment, always include /NK prefix
  const baseUrl = '/NK';
  return `${baseUrl}${path}`;
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
