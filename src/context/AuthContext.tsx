'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user type
type User = {
  username: string;
  role: string;
};

// Define auth context type
type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
};

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Initialize auth state from localStorage
  useEffect(() => {
    // Immediately check localStorage (synchronously)
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Found stored user on init:', parsedUser.username);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    // Mark initialization as complete
    setIsLoading(false);
  }, []);
  
  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Validate credentials against environment variables
      const expectedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
      const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';
      
      if (username !== expectedUsername || password !== expectedPassword) {
        console.error('Invalid credentials');
        return false;
      }
      
      // Create user object
      const userData = { username, role: 'admin' };
      const tokenValue = 'mock-jwt-token';
      
      // Store authentication data
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', tokenValue);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('Login successful:', username);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    // Clear authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('User logged out');
    
    // Force page refresh to reset any app state
    window.location.href = '/login';
  };
  
  // Provide context
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
