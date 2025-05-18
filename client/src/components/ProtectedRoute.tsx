'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, refreshAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // If still loading, wait
      if (isLoading) return;

      // If not authenticated, try to refresh token
      if (!isAuthenticated) {
        const refreshed = await refreshAuth();
        
        // If refresh failed, redirect to login
        if (!refreshed) {
          router.push('/');
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, refreshAuth, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;