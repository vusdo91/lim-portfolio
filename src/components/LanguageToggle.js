import React from 'react';
import styled from 'styled-components';
import { useOptionalLanguage } from '../contexts/LanguageContext';
import { LanguageIcon } from './icons/SVGIcons';

const ToggleButton = styled.button`
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 0 5px 7px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: 400 14px/1 'Pretendard Variable', Pretendard, sans-serif;
  transition: opacity 220ms ease;
  svg { display: block; width: 16px; height: 16px; }
  &:hover { opacity: .5; }
  &:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; }
  @media (max-width: 600px) { grid-column: 2; display: ${props => props.$hideOnMobile ? 'none' : 'inline-flex'}; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export default function LanguageToggle({ hideOnMobile = false }) {
  const context = useOptionalLanguage();
  const language = context?.language || 'ko';
  const nextLanguage = language === 'ko' ? 'en' : 'ko';
  return <ToggleButton $hideOnMobile={hideOnMobile} type="button" disabled={context?.languageTransitioning} aria-label={`${nextLanguage === 'en' ? 'English' : '한국어'}로 전환`} lang="en" onClick={() => context?.switchLanguage(nextLanguage)}>
    <LanguageIcon />
    <span>{language === 'ko' ? 'Ko' : 'En'}</span>
  </ToggleButton>;
}
