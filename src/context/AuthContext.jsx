// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // This user object should now contain { id: ..., token: ..., role: ..., email: ... }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // IMPORTANT: Ensure parsedUser has 'id', 'token', 'role', and 'email' properties
        if (parsedUser && parsedUser.id && parsedUser.token && parsedUser.email) {
          setUser(parsedUser);
        } else {
          console.warn("User data in localStorage is incomplete (missing id, token, or email). Clearing.");
          localStorage.removeItem('user');
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // userData should contain { id: ..., token: ..., role: ..., email: ... }
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

