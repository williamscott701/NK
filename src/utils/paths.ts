// Utility functions for handling paths with base URL
export const getPath = (path: string): string => {
  const baseUrl = import.meta.env.BASE_URL || '';
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
};
