'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/DashboardLayout';

// Dynamically import the dashboard content with SSR disabled
const DashboardContent = dynamic(() => import('@/components/DashboardContent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading dashboard...</p>
      </div>
    </div>
  )
});

// Dashboard page component
export default function Dashboard() {
  const { user, isLoading } = useAuth();
  
  // Debug authentication state
  useEffect(() => {
    console.log('Dashboard page - Auth state:', { user, isLoading });
  }, [user, isLoading]);
  
  // Don't render anything until authentication state is determined
  if (isLoading) {
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
  
  // If user is not authenticated, we don't render anything
  // The auth context will handle the redirect to login
  if (!user) {
    return null;
  }
  
  // Only render dashboard for authenticated users
  return (
    <DashboardLayout title="Dashboard">
      <DashboardContent />
    </DashboardLayout>
  );
}
