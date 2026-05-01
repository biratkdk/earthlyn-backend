import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    name: user.name || user.display_name || user.displayName || user.email?.split('@')[0],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/auth/me')
      .then(data => {
        setUser(normalizeUser(data.user || data));
        setError(null);
      })
      .catch((err) => {
        setUser(null);
        if (err?.status !== 401) {
          setError(err);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setUser(normalizeUser(data.user));
      return data;
    } catch (err) {
      setError(null);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ displayName: name, email, password }),
      });
      setUser(normalizeUser(data.user));
      return data;
    } catch (err) {
      setError(null);
      throw err;
    }
  };

  const signOut = async () => {
    const previousUser = user;
    setUser(null);
    setError(null);
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      setUser(previousUser);
      setError(err);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signIn: login,
    login,
    register,
    signOut,
    email: user?.email,
    name: user?.name || user?.email?.split('@')[0],
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  return useContext(AuthContext);
}
