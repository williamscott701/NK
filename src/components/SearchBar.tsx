import { useState, useEffect } from 'react';
import { PATHS } from '../utils/paths';

interface SearchProps {
  placeholder?: string;
  booksData: any;
  conceptsData: any;
  storiesData: any;
}

interface SearchResult {
  type: 'book' | 'chapter' | 'concept' | 'story';
  title: string;
  description: string;
  url: string;
  relevance: number;
}

export default function SearchBar({ placeholder = "Search Bible verses, concepts, or topics...", booksData, conceptsData, storiesData }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Debug: Log props data on component mount
  useEffect(() => {
    console.log('SearchBar mounted with props');
    console.log('Books data:', booksData);
    console.log('Concepts data:', conceptsData);
    console.log('Stories data:', storiesData);
  }, [booksData, conceptsData, storiesData]);

  // Search through all data sources
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    try {
      // Search in books and chapters
      booksData.books.forEach((book: any) => {
        // Search in book name and description
        if (book.name.toLowerCase().includes(queryLower)) {
          results.push({
            type: 'book',
            title: book.name,
            description: book.description,
            url: PATHS.book(book.id),
            relevance: 10
          });
        }
        
        // Search in book author
        if (book.author && book.author.toLowerCase().includes(queryLower)) {
          results.push({
            type: 'book',
            title: `${book.name} - by ${book.author}`,
            description: book.description,
            url: PATHS.book(book.id),
            relevance: 9
          });
        }
        
        // Search in book themes
        if (book.themes && book.themes.some((theme: string) => theme.toLowerCase().includes(queryLower))) {
          results.push({
            type: 'book',
            title: `${book.name} - Themes`,
            description: `Contains themes: ${book.themes.join(', ')}`,
            url: PATHS.book(book.id),
            relevance: 8
          });
        }

        // Search in chapters
        if (book.chaptersContent) {
          book.chaptersContent.forEach((chapter: any) => {
            if (chapter.title && chapter.title.toLowerCase().includes(queryLower) || 
                chapter.summary && chapter.summary.toLowerCase().includes(queryLower) ||
                chapter.themes && chapter.themes.some((theme: string) => theme.toLowerCase().includes(queryLower))) {
              results.push({
                type: 'chapter',
                title: `${book.name} - Chapter ${chapter.number}`,
                description: chapter.title || chapter.summary || '',
                url: PATHS.chapter(book.id, chapter.number),
                relevance: 7
              });
            }
          });
        }
      });

      // Search in concepts
      conceptsData.concepts.forEach((concept: any) => {
        if (concept.title && concept.title.toLowerCase().includes(queryLower) || 
            concept.description && concept.description.toLowerCase().includes(queryLower)) {
          results.push({
            type: 'concept',
            title: concept.title,
            description: concept.description,
            url: PATHS.concept(concept.id),
            relevance: 9
          });
        }
      });

      // Search in stories
      storiesData.stories.forEach((story: any) => {
        if (story.title && story.title.toLowerCase().includes(queryLower) || 
            story.summary && story.summary.toLowerCase().includes(queryLower) ||
            story.themes && story.themes.some((theme: string) => theme.toLowerCase().includes(queryLower))) {
          results.push({
            type: 'story',
            title: story.title,
            description: story.summary,
            url: PATHS.story(story.id),
            relevance: 8
          });
        }
      });
      
      // Sort by relevance and remove duplicates
      const uniqueResults = results.filter((result, index, self) => 
        index === self.findIndex(r => r.url === result.url)
      );
      
      uniqueResults.sort((a, b) => b.relevance - a.relevance);
      setSearchResults(uniqueResults.slice(0, 10)); // Limit to top 10 results
      setShowResults(true);

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
  }, [searchQuery]);

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
      case 'concept': return '💡';
      case 'story': return '📚';
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'book': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'chapter': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'concept': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'story': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <form onSubmit={handleSearch} className="relative">
        <div className={`relative transition-all duration-300 ${
          isFocused ? 'transform scale-105' : ''
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-bible-gold/20 to-bible-blue/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center p-6">
              <svg 
                className="w-8 h-8 text-bible-blue mr-4 flex-shrink-0" 
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
                placeholder={placeholder}
                className="flex-1 text-xl text-gray-800 placeholder-gray-500 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="ml-4 px-8 py-3 bg-gradient-to-r from-bible-blue to-blue-600 text-white font-semibold rounded-xl hover:from-bible-blue/90 hover:to-blue-600/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-3 px-2">
              Found {searchResults.length} results
            </div>
            {searchResults.map((result, index) => (
              <a
                key={index}
                href={result.url}
                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getTypeIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{result.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchQuery.trim() && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-lg font-medium mb-2">No results found</p>
            <p className="text-sm">Try searching for different keywords or browse our categories</p>
          </div>
        </div>
      )}
    </div>
  );
}
