import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api, setAccessToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (emailOrEmployeeId: string, password?: string) => Promise<User>;
  register: (name: string, email: string, role: Role, password?: string, domain?: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string, domain?: string) => Promise<User>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isProjectCoordinator: boolean;
  isIntern: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // On mount: try to restore session using the httpOnly refresh cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.post('/auth/refresh');
        const { accessToken: token, user: userData } = response.data;
        setAccessToken(token);
        setAccessTokenState(token);
        setUser(userData);
      } catch {
        // No valid refresh token — user needs to log in
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    // Listen for token refresh events from the Axios interceptor
    const handleTokenRefresh = (e: Event) => {
      const token = (e as CustomEvent<string>).detail;
      setAccessTokenState(token);
    };
    const handleLogout = () => {
      setUser(null);
      setAccessTokenState(null);
    };

    window.addEventListener('auth:token_refreshed', handleTokenRefresh);
    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:token_refreshed', handleTokenRefresh);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const login = async (emailOrEmployeeId: string, password?: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: emailOrEmployeeId,
        password,
      });
      const { accessToken: token, user: userData } = response.data;
      setAccessToken(token);
      setAccessTokenState(token);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, role: Role, password?: string, domain?: string): Promise<User> => {
    const response = await api.post('/auth/register', { name, email, role, password, domain });
    return response.data;
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors — still clear local state
    }
    setAccessToken(null);
    setAccessTokenState(null);
    setUser(null);
  };

  const updateProfile = async (name: string, email: string, domain?: string): Promise<User> => {
    const response = await api.patch('/users/profile', { name, email, domain });
    const updated = response.data;
    setUser(updated);
    return updated;
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.patch('/users/change-password', { oldPassword, newPassword });
    if (user) {
      setUser({ ...user, mustChangePassword: false });
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isProjectCoordinator: user?.role === 'PROJECT_COORDINATOR',
    isIntern: user?.role === 'INTERN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
