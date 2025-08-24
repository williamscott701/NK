import React from 'react';

interface BuyMeACoffeeProps {
  username?: string;
  className?: string;
}

const BuyMeACoffee: React.FC<BuyMeACoffeeProps> = ({ 
  username = 'yourusername', 
  className = '' 
}) => {
  const handleClick = () => {
    // Open Buy Me a Coffee in a new tab
    window.open(`https://www.buymeacoffee.com/${username}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors duration-200 ${className}`}
      aria-label="Buy me a coffee"
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 104 0 2 2 0 00-4 0zm6-4a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Buy me a coffee
    </button>
  );
};

export default BuyMeACoffee;
