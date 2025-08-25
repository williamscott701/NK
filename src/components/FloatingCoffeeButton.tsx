import React from 'react';

interface FloatingCoffeeButtonProps {
  url?: string;
  className?: string;
}

const FloatingCoffeeButton: React.FC<FloatingCoffeeButtonProps> = ({ 
  url = "https://www.buymeacoffee.com/yourusername", 
  className = "" 
}) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <button
        onClick={handleClick}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
        aria-label="Buy me a coffee"
        title="Buy me a coffee"
      >
        {/* Coffee cup icon */}
        <svg 
          className="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 21h18v-2H2v2zm6-4h12v-2H8v2zm-6-4h16v-2H2v2zm6-4h12V7H8v2zM2 3v2h16V3H2z"/>
        </svg>
        
        {/* Hover text */}
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Buy me a coffee
        </span>
      </button>
    </div>
  );
};

export default FloatingCoffeeButton;
