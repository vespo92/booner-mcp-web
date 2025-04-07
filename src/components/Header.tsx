import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
            <span className="sr-only">User menu</span>
            <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
              MCP
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
