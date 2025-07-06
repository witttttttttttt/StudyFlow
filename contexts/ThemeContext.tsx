// Powered by OnSpace.AI
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    gradient: string[];
    timerGradient: string[];
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
    sizes: {
      small: number;
      medium: number;
      large: number;
      xlarge: number;
    };
  };
}

const themes: { [key: string]: Theme } = {
  aesthetic: {
    name: 'Aesthetic',
    colors: {
      primary: '#FF6B9D',
      secondary: '#A8E6CF',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#2D3748',
      textSecondary: '#718096',
      border: '#E2E8F0',
      gradient: ['#FF6B9D', '#FF8E6B', '#FFB366'],
      timerGradient: ['#FF6B9D', '#C44569', '#8E44AD'],
    },
    fonts: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
      sizes: {
        small: 12,
        medium: 16,
        large: 20,
        xlarge: 28,
      },
    },
  },
  minimalist: {
    name: 'Minimalist',
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      background: '#F7FAFC',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      border: '#E2E8F0',
      gradient: ['#667EEA', '#764BA2'],
      timerGradient: ['#4A90E2', '#357ABD'],
    },
    fonts: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
      sizes: {
        small: 14,
        medium: 16,
        large: 18,
        xlarge: 24,
      },
    },
  },
  warm: {
    name: 'Warm',
    colors: {
      primary: '#F6AD55',
      secondary: '#FC8181',
      background: '#FFFAF0',
      surface: '#FFFFFF',
      text: '#2D3748',
      textSecondary: '#718096',
      border: '#E2E8F0',
      gradient: ['#F6AD55', '#FC8181', '#F687B3'],
      timerGradient: ['#F6AD55', '#ED8936', '#DD6B20'],
    },
    fonts: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
      sizes: {
        small: 13,
        medium: 17,
        large: 21,
        xlarge: 30,
      },
    },
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.aesthetic);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('selectedTheme');
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(themes[savedTheme]);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themes[themeName]);
      try {
        await AsyncStorage.setItem('selectedTheme', themeName);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    }
  };

  const value = {
    currentTheme,
    setTheme,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}