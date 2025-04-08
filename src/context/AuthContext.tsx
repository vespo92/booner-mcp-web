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

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          // Uncomment when API is ready
          // Verify token with the server
          // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
          //   method: 'GET',
          //   headers: {
          //     'Authorization': `Bearer ${token}`
          //   }
          // });
          
          // if (response.ok) {
          //   setUser(JSON.parse(storedUser));
          // } else {
          //   localStorage.removeItem('user');
          //   localStorage.removeItem('token');
          // }

          // For now, just set the user from localStorage
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error verifying authentication:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Uncomment when API is ready
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username, password }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Invalid credentials');
      // }
      
      // const data = await response.json();
      // const { token, user } = data;
      
      // For now, check against environment variables
      const expectedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
      const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';
      
      // Validate credentials
      if (username !== expectedUsername || password !== expectedPassword) {
        console.error('Invalid credentials');
        setIsLoading(false);
        return false;
      }
      
      const mockUser = { username, role: 'admin' };
      const mockToken = 'mock-jwt-token';

      // Store user info and token
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      // Update context
      setUser(mockUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Uncomment when API is ready
    // const token = localStorage.getItem('token');
    // if (token) {
    //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   }).catch(error => {
    //     console.error('Error during logout:', error);
    //   });
    // }

    // Remove user info and token
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Update context
    setUser(null);
    
    // Redirect to login page
    router.push('/login');
  };

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
