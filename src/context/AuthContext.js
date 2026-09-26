import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  saveUser,
  findUser,
} from '../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from AsyncStorage on app mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedUser = await getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  /**
   * Register a new user and establish a persistent active session.
   */
  const signup = async (name, email, password) => {
    try {
      const result = await saveUser({ name, email, password });
      if (!result.success) {
        return { success: false, error: result.error };
      }

      await setCurrentUser(result.user);
      setUser(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'System error, please try again.',
      };
    }
  };

  /**
   * Authenticate an existing user and persist session.
   */
  const login = async (email, password) => {
    try {
      const result = await findUser(email, password);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      await setCurrentUser(result.user);
      setUser(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'System error, please try again.',
      };
    }
  };

  /**
   * Terminate active session and clear persistent storage.
   */
  const logout = async () => {
    try {
      await clearCurrentUser();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if storage fails, clear context state
      setUser(null);
      return {
        success: false,
        error: 'System error, please try again.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to consume AuthContext cleanly in screens and components.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
