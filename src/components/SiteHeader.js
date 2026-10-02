import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { TransitionLink } from './PageTransition';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import MobileNavigation from './MobileNavigation';
import studioLogo from '../assets/logo_studioLimyunmook.svg';
import SkeletonImage from './SkeletonImage';

const Header = styled.header`
  position: fixed;
  top: 0;
  z-index: 1000;
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  padding: 0 4vw;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: var(--site-header, rgba(255,255,255,.82));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: var(--site-text, #111);
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  > a { justify-self: start; }
  img { display: block; width: auto; height: 10px; filter: var(--site-logo-filter, none); }
  @media (max-width: 600px) {
    height: 64px;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-content: center;
    > a { width: min(165px, calc(100vw - 190px)); }
    > a > span { width: 100% !important; }
    img { max-width: 100%; }
  }
`;
const Nav = styled.nav`
  display: flex;
  gap: 10px;
  grid-column: 2;
  grid-row: 1;
  a {
    color: inherit;
    font: 400 14px/1.4 'Pretendard Variable', Pretendard, sans-serif;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 220ms ease;
  }
  &:has(:hover, :focus-visible) > :not(:hover):not(:focus-visible) { opacity: .35; }
  a:focus-visible { outline: 1px solid currentColor; outline-offset: 4px; }
  @media (max-width: 600px) { display: none; }
  @media (prefers-reduced-motion: reduce) { a { transition: none; } }
`;

const HeaderControls = styled.div`
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 12px;
  @media (max-width: 600px) {
    grid-column: 2;
    gap: 8px;
    margin-right: 42px;
  }
`;

export default function SiteHeader() {
  const location = useLocation();
  return <Header data-site-header>
    <TransitionLink to="/" aria-label="STUDIO LIM YUN MOOK"><SkeletonImage src={studioLogo} alt="STUDIO LIM YUN MOOK" style={{ width: 165, height: 10, minWidth: 0, aspectRatio: '660 / 40' }} /></TransitionLink>
    <Nav aria-label="Main navigation">
      <TransitionLink to="/" aria-current={location.pathname === '/' ? 'page' : undefined}>Home</TransitionLink>
      <TransitionLink to="/works" aria-current={location.pathname === '/works' ? 'page' : undefined}>Works</TransitionLink>
      <TransitionLink to="/about" aria-current={location.pathname === '/about' ? 'page' : undefined}>About</TransitionLink>
      <TransitionLink to="/contact" aria-current={location.pathname === '/contact' ? 'page' : undefined}>Contact</TransitionLink>
    </Nav>
    <HeaderControls><LanguageToggle /><ThemeToggle /></HeaderControls>
    <MobileNavigation top="58px" />
  </Header>;
}
