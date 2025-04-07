import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: 'chart-line' },
    { href: '/game-servers', label: 'Game Servers', icon: 'gamepad' },
    { href: '/web-servers', label: 'Web Servers', icon: 'globe' },
    { href: '/infrastructure', label: 'Infrastructure', icon: 'server' },
    { href: '/tasks', label: 'Tasks', icon: 'tasks' },
    { href: '/settings', label: 'Settings', icon: 'cog' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 h-screen hidden md:block">
      <div className="p-4 flex items-center">
        <span className="text-xl font-bold">Booner MCP</span>
      </div>
      <nav className="mt-8">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link 
                href={item.href}
                className={`flex items-center py-2 px-4 hover:bg-gray-700 transition-colors ${
                  pathname === item.href ? 'bg-gray-700' : ''
                }`}
              >
                <i className={`fas fa-${item.icon} mr-3 w-5`}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
