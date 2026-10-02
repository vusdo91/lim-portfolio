import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useOptionalLanguage } from '../contexts/LanguageContext';

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 5px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  svg { width: 18px; height: 18px; }
  &:hover { opacity: .55; }
  &:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; }
`;
export default function ThemeToggle() {
  const context = useTheme();
  const language = useOptionalLanguage()?.language || 'ko';
  const dark = context?.theme === 'dark';
  const label = language === 'en' ? (dark ? 'Switch to light mode' : 'Switch to dark mode') : (dark ? '\uB77C\uC774\uD2B8\uBAA8\uB4DC\uB85C \uC804\uD658' : '\uB2E4\uD06C\uBAA8\uB4DC\uB85C \uC804\uD658');
  return <Button type="button" aria-label={label} title={label} aria-pressed={dark} onClick={() => context?.toggleTheme()}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />}
    </svg>
  </Button>;
}
