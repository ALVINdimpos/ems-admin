"use client";

/**
 * Authentication Context
 * TODO: Implement actual authentication logic
 */

import { createContext, useContext, ReactNode } from "react";

interface IAuthContext {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: Implement authentication state and logic

  const value: IAuthContext = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async (email: string, password: string) => {
      // TODO: Implement login logic
      console.log("Login:", email, password);
    },
    logout: () => {
      // TODO: Implement logout logic
      console.log("Logout");
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
