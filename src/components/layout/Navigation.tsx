// Navigation component
// Following the clean architecture principle of single-responsibility components

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface NavigationProps {
  items?: NavigationItem[];
  className?: string;
}

const defaultItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
      </svg>
    )
  },
  {
    name: 'New Job',
    href: '/jobs/new',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    )
  }
];

const Navigation: React.FC<NavigationProps> = ({
  items = defaultItems,
  className = ''
}) => {
  const router = useRouter();

  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map((item) => {
        const isActive = router.pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon && (
              <span className={`mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                {item.icon}
              </span>
            )}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
