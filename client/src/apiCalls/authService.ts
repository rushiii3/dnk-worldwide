import apiClient from './index';

interface User {
  fullname: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
}

interface AuthResponse {
  message: string;
  user: User;
  status: boolean;
}

interface RefreshTokenResponse {
  message: string;
  status: boolean;
}

// Auth service functions
export const authService = {
  /**
   * Get the current authenticated user
   * @returns Promise with user data on success
   */
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const response = await apiClient.get<AuthResponse>('/user/verified-user');
      
      // Store minimal user info in localStorage for isAuthenticated checks
      if (response.data.user) {
        localStorage.setItem('userInfo', JSON.stringify({
          fullname: response.data.user.fullname,
          email: response.data.user.email,
        }));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile information
   * @param data Object containing fullname and email
   * @returns Promise with success message
   */
  updateUserProfile: async (data: { fullname: string; email: string }): Promise<{ message: string; status: boolean }> => {
    try {
      const response = await apiClient.patch<{ message: string; status: boolean }>('/user/profile-update', data);
      
      // Update stored user info with new data
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        localStorage.setItem('userInfo', JSON.stringify({
          ...parsedUserInfo,
          fullname: data.fullname,
          email: data.email,
        }));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh the access token using refresh token (automatically uses cookie)
   * @returns Promise with success message
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    try {
      const response = await apiClient.post<RefreshTokenResponse>('/user/refresh-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Log out the user by clearing cookies and local storage
   * @returns Promise with success on logout
   */
  logout: async (): Promise<void> => {
    try {
      // Make an API call to clear server-side cookies
      await apiClient.post('/user/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and cookies regardless of API success
      localStorage.removeItem('userInfo');
      
      // Clear cookies (though server should handle this properly)
      document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure;';
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure;';
    }
  },

  /**
   * Check if the user is authenticated
   * @returns boolean indicating if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') {
      return false; // Server-side rendering
    }
    
    // Check localStorage for user info as primary source
    const userInfo = localStorage.getItem('userInfo');
    
    // Check for existence of cookies as fallback
    const hasAccessToken = document.cookie.includes('accessToken=');
    
    return !!(userInfo || hasAccessToken);
  }
};

export default authService;