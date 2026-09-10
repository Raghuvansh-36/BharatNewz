import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Replace these placeholders with your authentication API calls.
  const signIn = async (credentials) => {
    console.log('Connect signIn to your auth service:', credentials);
    throw new Error('Authentication is not connected yet.');
  };

  const signUp = async (details) => {
    console.log('Connect signUp to your auth service:', details);
    throw new Error('Authentication is not connected yet.');
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
