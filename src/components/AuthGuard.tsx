'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ 
  children,
  requireAuth = true
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  
  useEffect(() => {
    // Only check authentication after loading is complete
    if (!isLoading) {
      // For protected routes, redirect to login if not authenticated
      if (requireAuth && !isAuthenticated) {
        console.log('AuthGuard: Protected route, user not authenticated. Redirecting to login...');
        
        // Ensure we're not already on the login page to prevent loops
        const isLoginPage = window.location.pathname === '/login';
        if (!isLoginPage) {
          // Use a longer timeout to prevent redirect loops
          const redirectTimer = setTimeout(() => {
            window.location.replace('/login');
          }, 500);
          return () => clearTimeout(redirectTimer);
        }
      }
      
      // For login page, redirect to dashboard if already authenticated
      if (!requireAuth && isAuthenticated) {
        console.log('AuthGuard: Login page, user authenticated. Redirecting to dashboard...');
        
        // Ensure we're not already on the dashboard to prevent loops
        const isDashboardPage = window.location.pathname === '/';
        if (!isDashboardPage) {
          // Use a longer timeout to prevent redirect loops
          const redirectTimer = setTimeout(() => {
            window.location.replace('/');
          }, 500);
          return () => clearTimeout(redirectTimer);
        }
      }
      
      // Authentication validation complete
      setIsValidating(false);
    }
  }, [isLoading, isAuthenticated, requireAuth]);
  
  // Show loading state during validation
  if (isLoading || isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Render children when authentication is valid
  return <>{children}</>;
}
