// Header component
// Following the clean architecture principle of single-responsibility components

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title = 'PubMed PDF Scraper',
  subtitle,
  showBackButton = false,
  onBackClick,
  actions
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={onBackClick}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div>
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {title}
              </Link>
              {subtitle && (
                <p className="text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {actions}

            {/* Navigation links */}
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/jobs/new"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                New Job
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
