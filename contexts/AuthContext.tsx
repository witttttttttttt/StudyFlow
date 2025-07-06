// Powered by OnSpace.AI
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Study Explorer',
    email: 'student@studyflow.com',
  });
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'Study Explorer',
        email,
      });
      setIsLoading(false);
    }, 1000);
  };

  const signOut = () => {
    setUser(null);
  };

  const value = {
    user,
    signIn,
    signOut,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}