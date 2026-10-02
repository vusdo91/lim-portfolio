import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);
const ThemeStyle = createGlobalStyle`
  :root {
    color-scheme: ${props => props.$dark ? 'dark' : 'light'};
    --site-bg: ${props => props.$dark ? '#141414' : '#fff'};
    --site-text: ${props => props.$dark ? '#eeeeee' : '#111'};
    --site-muted: ${props => props.$dark ? '#b0b0b0' : '#505050'};
    --site-subtle: ${props => props.$dark ? '#969696' : '#777'};
    --site-header: ${props => props.$dark ? 'rgba(20,20,20,.82)' : 'rgba(255,255,255,.82)'};
    --site-line: ${props => props.$dark ? '#414141' : '#e0e0e0'};
    --site-button: ${props => props.$dark ? '#eeeeee' : '#000'};
    --site-button-text: ${props => props.$dark ? '#141414' : '#fff'};
    --site-filter-line: ${props => props.$dark ? '#889985' : '#50614f'};
    --site-filter-text: ${props => props.$dark ? '#c0d0bb' : '#344633'};
    --site-hover-bg: ${props => props.$dark ? '#233044' : '#EAF0FF'};
    --site-accent: ${props => props.$dark ? '#96b6ff' : '#2050CA'};
    --site-logo-filter: ${props => props.$dark ? 'invert(1)' : 'none'};
    --site-skeleton: ${props => props.$dark ? '#292929' : '#eeeeec'};
    --site-skeleton-shine: ${props => props.$dark ? '#383838' : '#f7f7f5'};
  }
  body { background: var(--site-bg); color: var(--site-text); }
`;

export function ThemeProvider({ children }) {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('lim-portfolio-theme') === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  });
  useEffect(() => {
    try { localStorage.setItem('lim-portfolio-theme', theme); } catch { /* Storage may be unavailable. */ }
  }, [theme]);
  useEffect(() => {
    const sync = event => {
      if (event.key === 'lim-portfolio-theme') setTheme(event.newValue === 'dark' ? 'dark' : 'light');
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(value => value === 'dark' ? 'light' : 'dark') }}>
    <ThemeStyle $dark={theme === 'dark' && !pathname.startsWith('/admin')} />
    {children}
  </ThemeContext.Provider>;
}
