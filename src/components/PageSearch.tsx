import { useState, useEffect, useRef } from 'react';

interface PageSearchProps {
  placeholder?: string;
  booksData?: any;
  storiesData?: any;
  conceptsData?: any;
  searchMode?: 'all' | 'stories' | 'concepts' | 'books';
  onSearchResults?: (results: any[]) => void;
}

interface SearchResult {
  type: 'book' | 'chapter' | 'story' | 'concept';
  title: string;
  description: string;
  url: string;
  relevance: number;
}

export default function PageSearch({ 
  placeholder = "Search...", 
  booksData,
  storiesData,
  conceptsData,
  searchMode = 'all',
  onSearchResults
}: PageSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchBarPosition, setSearchBarPosition] = useState({ top: 0, left: 0, width: 0 });
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Update search bar position when component mounts and on resize
  useEffect(() => {
    const updatePosition = () => {
      if (searchBarRef.current) {
        const rect = searchBarRef.current.getBoundingClientRect();
        setSearchBarPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  // Search through books, stories, and concepts
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    console.log('Searching for:', query, 'in mode:', searchMode);
    console.log('Books data received:', booksData);
    console.log('Stories data received:', storiesData);
    console.log('Concepts data received:', conceptsData);

    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    try {
      // Search in books if available and mode allows
      if (booksData && (searchMode === 'all' || searchMode === 'books')) {
        const books = booksData.books || booksData;
        console.log('Books array to search:', books);
        
        books.forEach((book: any) => {
          // Search in book name and description
          if (book.name.toLowerCase().includes(queryLower)) {
            console.log('Found matching book:', book.name);
            results.push({
              type: 'book',
              title: book.name,
              description: book.description,
              url: `/book/${book.id}`,
              relevance: 10
            });
          }
          
          // Search in book author
          if (book.author && book.author.toLowerCase().includes(queryLower)) {
            console.log('Found book by author:', book.name, 'by', book.author);
            results.push({
              type: 'book',
              title: `${book.name} - by ${book.author}`,
              description: book.description,
              url: `/book/${book.id}`,
              relevance: 9
            });
          }
          
          // Search in book themes
          if (book.themes && book.themes.some((theme: string) => theme.toLowerCase().includes(queryLower))) {
            console.log('Found book with matching theme:', book.name);
            results.push({
              type: 'book',
              title: `${book.name} - Themes`,
              description: `Contains themes: ${book.themes.join(', ')}`,
              url: `/book/${book.id}`,
              relevance: 8
            });
          }

          // Search in chapters
          if (book.chaptersContent) {
            book.chaptersContent.forEach((chapter: any) => {
              if (chapter.title && chapter.title.toLowerCase().includes(queryLower) || 
                  chapter.summary && chapter.summary.toLowerCase().includes(queryLower) ||
                  chapter.themes && chapter.themes.some((theme: string) => theme.toLowerCase().includes(queryLower))) {
                console.log('Found matching chapter:', `${book.name} Chapter ${chapter.number}`);
                results.push({
                  type: 'chapter',
                  title: `${book.name} - Chapter ${chapter.number}`,
                  description: chapter.title || chapter.summary || '',
                  url: `/book/${book.id}/chapter/${chapter.number}`,
                  relevance: 7
                });
              }
            });
          }
        });
      }

      // Search in stories if available and mode allows
      if (storiesData && (searchMode === 'all' || searchMode === 'stories')) {
        const stories = storiesData.stories || storiesData;
        console.log('Searching in stories:', stories);
        if (Array.isArray(stories)) {
          stories.forEach((story: any) => {
            // Search in story title
            if (story.title && story.title.toLowerCase().includes(queryLower)) {
              console.log('Found matching story:', story.title);
              results.push({
                type: 'story',
                title: story.title,
                description: story.summary,
                url: `/story/${story.id}`,
                relevance: 9
              });
            }
            
            // Search in story summary
            if (story.summary && story.summary.toLowerCase().includes(queryLower)) {
              console.log('Found story with matching summary:', story.title);
              results.push({
                type: 'story',
                title: story.title,
                description: story.summary,
                url: `/story/${story.id}`,
                relevance: 8
              });
            }
            
            // Search in story themes
            if (story.themes && story.themes.some((theme: string) => theme.toLowerCase().includes(queryLower))) {
              console.log('Found story with matching theme:', story.title);
              results.push({
                type: 'story',
                title: `${story.title} - Themes`,
                description: `Contains themes: ${story.themes.join(', ')}`,
                url: `/story/${story.id}`,
                relevance: 7
              });
            }
            
            // Search in story book reference
            if (story.book && story.book.toLowerCase().includes(queryLower)) {
              console.log('Found story in book:', story.title, 'in', story.book);
              results.push({
                type: 'story',
                title: `${story.title} - in ${story.book}`,
                description: story.summary,
                url: `/story/${story.id}`,
                relevance: 8
              });
            }
          });
        }
      }

      // Search in concepts if available and mode allows
      if (conceptsData && (searchMode === 'all' || searchMode === 'concepts')) {
        const concepts = conceptsData.concepts || conceptsData;
        console.log('Searching in concepts:', concepts);
        if (Array.isArray(concepts)) {
          concepts.forEach((concept: any) => {
            // Search in concept name
            if (concept.title && concept.title.toLowerCase().includes(queryLower)) {
              console.log('Found matching concept:', concept.title);
              results.push({
                type: 'concept',
                title: concept.title,
                description: concept.description,
                url: `/concept/${concept.id}`,
                relevance: 10
              });
            }
            
            // Search in concept description
            if (concept.description && concept.description.toLowerCase().includes(queryLower)) {
              console.log('Found concept with matching description:', concept.title);
              results.push({
                type: 'concept',
                title: concept.title,
                description: concept.description,
                url: `/concept/${concept.id}`,
                relevance: 8
              });
            }
          });
        }
      }

      console.log('All search results:', results);
      
      // Sort by relevance and remove duplicates
      const uniqueResults = results.filter((result, index, self) => 
        index === self.findIndex(r => r.url === result.url)
      );
      
      uniqueResults.sort((a, b) => b.relevance - a.relevance);
      console.log('Final unique results:', uniqueResults);
      setSearchResults(uniqueResults.slice(0, 10)); // Limit to top 10 results
      setShowResults(true);

      // Notify parent component of results
      if (onSearchResults) {
        onSearchResults(uniqueResults);
      }

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  // Search on input change
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, booksData, storiesData, conceptsData, searchMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return '📖';
      case 'chapter': return '📄';
      case 'story': return '📚';
      case 'concept': return '🧠';
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'book': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'chapter': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'story': return 'bg-green-100 text-green-800 border-green-200';
      case 'concept': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative z-[9998]" ref={searchBarRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className={`relative transition-all duration-300 ${
          isFocused ? 'transform scale-105' : ''
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-bible-gold/10 to-bible-blue/10 rounded-xl blur-lg"></div>
          <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center p-3 sm:p-4 gap-3 sm:gap-0">
              <div className="flex items-center w-full sm:w-auto flex-1">
                <svg 
                  className="w-5 h-5 text-bible-blue mr-3 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    setTimeout(() => setShowResults(false), 200);
                  }}
                  placeholder={searchMode === 'all' ? placeholder : 
                               searchMode === 'stories' ? "Search stories..." : 
                               searchMode === 'concepts' ? "Search concepts..." : 
                               "Search books..."}
                  className="flex-1 text-base sm:text-lg text-gray-800 placeholder-gray-500 bg-transparent outline-none w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-bible-blue to-blue-600 text-white font-semibold rounded-lg hover:from-bible-blue/90 hover:to-blue-600/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm sm:text-base"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div 
            className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto pointer-events-auto mx-4 sm:mx-0"
            style={{
              top: `${searchBarPosition.top + 8}px`,
              left: window.innerWidth < 640 ? '16px' : `${searchBarPosition.left}px`,
              width: window.innerWidth < 640 ? 'calc(100vw - 32px)' : `${searchBarPosition.width}px`
            }}
          >
            <div className="p-3 sm:p-4">
              <div className="text-sm text-gray-500 mb-3 px-2 flex items-center justify-between">
                <span>Found {searchResults.length} results</span>
                {searchMode !== 'all' && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {searchMode === 'stories' ? '📚 Stories only' : 
                     searchMode === 'concepts' ? '💡 Concepts only' : 
                     searchMode === 'books' ? '📖 Books only' : ''}
                  </span>
                )}
              </div>
              {searchResults.map((result, index) => (
                <a
                  key={index}
                  href={result.url}
                  className="block p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{getTypeIcon(result.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{result.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(result.type)}`}>
                          {result.type}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{result.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchQuery.trim() && searchResults.length === 0 && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div 
            className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-6 pointer-events-auto mx-4 sm:mx-0"
            style={{
              top: `${searchBarPosition.top + 8}px`,
              left: window.innerWidth < 640 ? '16px' : `${searchBarPosition.left}px`,
              width: window.innerWidth < 640 ? 'calc(100vw - 32px)' : `${searchBarPosition.width}px`
            }}
          >
            <div className="text-center text-gray-500">
              <div className="text-3xl sm:text-4xl mb-2">🔍</div>
              <p className="text-base sm:text-lg font-medium mb-2">No results found</p>
              <p className="text-xs sm:text-sm">Try searching for different keywords</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
