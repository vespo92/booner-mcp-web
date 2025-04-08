'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check if user is already logged in on mount and storage changes
  useEffect(() => {
    const checkAuth = () => {
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log('AuthContext checking stored auth:', { 
          hasStoredUser: !!storedUser, 
          hasToken: !!token 
        });
        
        if (storedUser && token) {
          // User is authenticated
          setUser(JSON.parse(storedUser));
        } else {
          // User is not authenticated
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Check auth on mount
    checkAuth();
    
    // Listen for storage events (for multi-tab support)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt with:', username);
      setIsLoading(true);
      
      // For now, check against environment variables
      const expectedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
      const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';
      
      console.log('Expected credentials:', expectedUsername, 'PASSWORD_LENGTH:', expectedPassword.length);
      
      // Validate credentials
      if (username !== expectedUsername || password !== expectedPassword) {
        console.error('Invalid credentials');
        return false;
      }
      
      console.log('Login successful, creating user object');
      
      const mockUser = { username, role: 'admin' };
      const mockToken = 'mock-jwt-token';

      // Store user info and token
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      // Update context state
      setUser(mockUser);
      
      console.log('User set in context, login successful');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    
    // Remove user info and token
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Update context
    setUser(null);
    
    // Redirect to login page
    window.location.href = '/login';
  };

  // Debug auth state changes
  useEffect(() => {
    console.log('Auth state changed:', { 
      user: user ? `${user.username} (${user.role})` : 'null', 
      isLoading 
    });
  }, [user, isLoading]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
