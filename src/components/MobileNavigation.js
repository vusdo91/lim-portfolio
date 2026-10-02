import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { TransitionLink } from './PageTransition';
const Toggle = styled.button`
  display: none;
  position: absolute;
  top: 50%;
  right: 4vw;
  z-index: 6;
  width: 30px;
  height: 30px;
  padding: 4px;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  @media (max-width: 600px) { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
  &:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; }
`;
const Line = styled.span`
  display: block;
  width: 20px;
  height: 1px;
  background: currentColor;
  transition: transform 180ms ease, opacity 180ms ease;
  &:first-child { transform: ${props => props.$open ? 'translateY(5px) rotate(45deg)' : 'none'}; }
  &:nth-child(2) { opacity: ${props => props.$open ? 0 : 1}; }
  &:last-child { transform: ${props => props.$open ? 'translateY(-5px) rotate(-45deg)' : 'none'}; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const Panel = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${props => props.$top} 4vw 34px;
  box-sizing: border-box;
  background: var(--site-bg, #fff);
  color: var(--site-text, #111);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  opacity: ${props => props.$open ? 1 : 0};
  visibility: ${props => props.$open ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$open ? '0' : '-12px'});
  transition: opacity 180ms ease, transform 180ms ease, visibility 180ms ease;
  a {
    display: block;
    padding: 13px 0;
    color: inherit;
    font: 400 14px/1.4 'Pretendard Variable', Pretendard, sans-serif;
    text-decoration: none;
  }
  a[aria-current='page'] { text-decoration: underline; text-underline-offset: 4px; }
  @media (min-width: 601px) { display: none; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const MenuLinks = styled.div`
  display: flex;
  flex-direction: column;
`;
export default function MobileNavigation({ top = '105px' }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = event => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);
  const panel = <Panel $open={open} $top={top} aria-label="Mobile navigation">
    <MenuLinks>
      <TransitionLink to="/" aria-current={location.pathname === '/' ? 'page' : undefined} onClick={close}>Home</TransitionLink>
      <TransitionLink to="/works" aria-current={location.pathname === '/works' ? 'page' : undefined} onClick={close}>Works</TransitionLink>
      <TransitionLink to="/about" aria-current={location.pathname === '/about' ? 'page' : undefined} onClick={close}>About</TransitionLink>
      <TransitionLink to="/contact" aria-current={location.pathname === '/contact' ? 'page' : undefined} onClick={close}>Contact</TransitionLink>
    </MenuLinks>
  </Panel>;
  return <>
    <Toggle type="button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} onClick={() => setOpen(value => !value)}>
      <Line $open={open} />
      <Line $open={open} />
      <Line $open={open} />
    </Toggle>
    {typeof document === 'undefined' ? null : createPortal(panel, document.body)}
  </>;
}
