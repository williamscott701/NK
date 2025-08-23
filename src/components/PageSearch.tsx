import { useState } from 'react';

interface PageSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
}

export default function PageSearch({ 
  placeholder = "Search...", 
  onSearch,
  suggestions = []
}: PageSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      console.log('Searching for:', searchQuery);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch?.(suggestion);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className={`relative transition-all duration-300 ${
          isFocused ? 'transform scale-105' : ''
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-bible-gold/10 to-bible-blue/10 rounded-xl blur-lg"></div>
          <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center p-4">
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
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="flex-1 text-lg text-gray-800 placeholder-gray-500 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="ml-3 px-6 py-2 bg-gradient-to-r from-bible-blue to-blue-600 text-white font-semibold rounded-lg hover:from-bible-blue/90 hover:to-blue-600/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Quick suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-full text-sm text-gray-700 hover:bg-white/70 hover:border-bible-gold/50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
