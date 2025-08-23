import { useState } from 'react';

interface SearchProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = "Search Bible verses, concepts, or topics..." }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
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
                onBlur={() => setIsFocused(false)}
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
      
      {/* Quick suggestions */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {['Love', 'Faith', 'Hope', 'Peace', 'Wisdom', 'Grace'].map((topic) => (
          <button
            key={topic}
            onClick={() => setSearchQuery(topic)}
            className="px-6 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-full text-gray-700 hover:bg-white/80 hover:border-bible-gold/50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {topic}
          </button>
        ))}
      </div>
      
      {/* Quick Navigation */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <a 
          href="/books" 
          className="px-4 py-2 bg-bible-blue/10 border border-bible-blue/20 rounded-lg text-bible-blue hover:bg-bible-blue/20 transition-all duration-200 text-sm font-medium"
        >
          📖 Browse Books
        </a>
        <a 
          href="/concepts" 
          className="px-4 py-2 bg-bible-gold/10 border border-bible-gold/20 rounded-lg text-bible-gold hover:bg-bible-gold/20 transition-all duration-200 text-sm font-medium"
        >
          💡 Explore Concepts
        </a>
        <a 
          href="/stories" 
          className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 hover:bg-green-500/20 transition-all duration-200 text-sm font-medium"
        >
          📚 Read Stories
        </a>
      </div>
    </div>
  );
}
