'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, tokenStr) => {
    localStorage.setItem('token', tokenStr);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenStr);
    setUser(userData);

    if (userData.role === 'Brand') {
      router.push('/dashboard/brand');
    } else {
      router.push('/dashboard/creator');
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  /**
   * Merge updated profile data into the current user state and localStorage.
   * Call this after saving profile edits so the Navbar/dashboard reflect changes instantly.
   */
  const updateUser = useCallback((updatedUserData) => {
    const merged = { ...user, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
