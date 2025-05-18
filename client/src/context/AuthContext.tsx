'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { useRouter } from 'next/navigation';
import { authService } from '../apiCalls/authService';

// Define user type
export interface User {
  fullname: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Function to get the current user from the API
  const fetchCurrentUser = async (): Promise<boolean> => {
    try {
      // Use the auth service instead of direct API call
      const response = await authService.getCurrentUser();
      
      if (response && response.user) {
        setUser({
          fullname: response.user.fullname || '',
          email: response.user.email || '',
          phoneNumber: response.user.phoneNumber,
          countryCode: response.user.countryCode,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return false;
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Check if already authenticated via localStorage
      if (authService.isAuthenticated()) {
        try {
          // Try to fetch user with current token
          await fetchCurrentUser();
        } catch (error) {
          console.error('Authentication validation failed:', error);
          // Clear invalid auth state
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store user data in localStorage
    localStorage.setItem('userInfo', JSON.stringify({
      fullname: userData.fullname,
      email: userData.email,
    }));
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to home page after logout
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Function to refresh authentication
  const refreshAuth = async (): Promise<boolean> => {
    try {
      // First try to refresh the token
      await authService.refreshToken();
      
      // Then fetch the current user
      return await fetchCurrentUser();
    } catch (error) {
      console.error('Failed to refresh authentication:', error);
      
      // Clear invalid auth state
      setUser(null);
      setIsAuthenticated(false);
      
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create this component to wrap protected routes
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : null;
};