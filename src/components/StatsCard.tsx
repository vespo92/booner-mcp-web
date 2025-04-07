import React, { ReactNode } from 'react';
import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  link?: string;
  linkText?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, link, linkText, change }) => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-white">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {(link || change) && (
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div className="text-sm">
            {link && (
              <Link
                href={link}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                {linkText || 'View all'}
              </Link>
            )}
            {change && (
              <div className={`font-medium ${
                change.type === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {change.type === 'increase' ? '↑' : '↓'} {change.value}%
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
