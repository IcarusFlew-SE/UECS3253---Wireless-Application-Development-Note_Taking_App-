import React, { createContext, useContext, useState, ReactNode, FC} from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { theme } from './theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    mode: ThemeMode;
    isDark: boolean;
    colors: typeof theme.dark;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');

    const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';
    const currentTheme = isDark ? theme.dark : theme.light;

    return (
        <ThemeContext.Provider value={{ mode, isDark, colors: currentTheme, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
}