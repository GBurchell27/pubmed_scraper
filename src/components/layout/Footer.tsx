// Footer component
// Following the clean architecture principle of single-responsibility components

import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>© {currentYear} PubMed PDF Scraper</span>
            <span>•</span>
            <span>Built for research efficiency</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <a
              href="#"
              className="hover:text-gray-900 transition-colors"
            >
              Documentation
            </a>
            <span>•</span>
            <a
              href="#"
              className="hover:text-gray-900 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
