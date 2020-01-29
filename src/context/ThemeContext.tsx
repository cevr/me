import React from 'react';

const DARK = 'dark';
const LIGHT = 'light';
const THEME_STORAGE_KEY = '__theme';

const ThemeStateContext = React.createContext<string | null>(null);
const ThemeToggleContext = React.createContext<() => void | null>(null);

const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = React.useState(DARK);
  const toggleTheme = React.useCallback(() => {
    setTheme(theme => {
      const nextTheme = theme === DARK ? LIGHT : DARK;
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  }, []);
  React.useEffect(() => {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    setTheme(window.localStorage.getItem(THEME_STORAGE_KEY) || prefersLight ? LIGHT : DARK);
  }, []);

  return (
    <ThemeToggleContext.Provider value={toggleTheme}>
      <ThemeStateContext.Provider value={theme}>{children}</ThemeStateContext.Provider>
    </ThemeToggleContext.Provider>
  );
};

function useTheme(): [string, () => void] {
  const theme = React.useContext(ThemeStateContext);
  const toggleTheme = React.useContext(ThemeToggleContext);

  if (!theme || !toggleTheme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return [theme, toggleTheme];
}

function useCurrentTheme(): string {
  const theme = React.useContext(ThemeStateContext);

  if (!theme) {
    throw new Error('useCurrentTheme must be used within a ThemeProvider');
  }

  return theme;
}

export { ThemeProvider, useTheme, useCurrentTheme, DARK, LIGHT };
