"use client";

/**
 * Theme Context
 * TODO: Implement theme switching logic
 */

import { createContext, useContext, ReactNode } from "react";

interface IThemeContext {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // TODO: Implement theme state and logic

  const value: IThemeContext = {
    theme: "light",
    toggleTheme: () => {
      // TODO: Implement theme toggle logic
      console.log("Toggle theme");
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
