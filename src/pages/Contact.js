import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MailIcon, InstagramIcon } from '../components/icons/SVGIcons';

const ContactContainer = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--site-bg, #fff);
  color: var(--site-text, #111);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  

`;

const ContactInfo = styled.div`
  display: flex;
  gap: 28px;
  align-items: center;
`;

const ContactItem = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  color: var(--site-text, #111);
  text-decoration: none;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  transition: transform 220ms ease;
  &:hover, &:focus-visible { transform: translateY(-4px); }
  &:hover .contact-icon, &:focus-visible .contact-icon { opacity: .55; }
  &:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; }
  
  .contact-icon {
    width: 30px;
    height: 30px;
    transition: opacity 220ms ease;
  }
  [role='tooltip'] {
    position: absolute;
    bottom: calc(100% + 9px);
    left: 50%;
    padding: 8px 11px;
    border-radius: 10px;
    background: #365d4a;
    box-shadow: 0 5px 16px rgba(25, 45, 34, .18);
    color: #fff;
    font: 400 12px/1.3 'Pretendard Variable', Pretendard, sans-serif;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transform: translate(-50%, 5px);
    transition: opacity 180ms ease, transform 180ms ease, visibility 180ms;
    pointer-events: none;
  }
  [role='tooltip']::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: inherit;
    transform: translateX(-50%) rotate(45deg);
  }
  &:hover [role='tooltip'], &:focus-visible [role='tooltip'] {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }
  @media (prefers-reduced-motion: reduce) { &, .contact-icon, [role='tooltip'] { transition: none; } }
`;

const CopyStatus = styled.span`
  position: fixed;
  bottom: calc(32px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  max-width: calc(100vw - 40px);
  width: max-content;
  padding: 12px 20px;
  border-radius: 12px;
  background: #365d4a;
  color: white;
  box-shadow: 0 5px 20px rgba(25, 45, 34, .18);
  font: 500 14px/1.5 'Pretendard Variable', Pretendard, sans-serif;
  text-align: center;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  visibility: ${({ $visible }) => $visible ? 'visible' : 'hidden'};
  transition: opacity 180ms ease, visibility 180ms;
  pointer-events: none;
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const Contact = () => {
  const [copyStatus, setCopyStatus] = useState('');
  const [copyVisible, setCopyVisible] = useState(false);
  const copyTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(copyTimer.current), []);
  const showCopyStatus = message => {
    window.clearTimeout(copyTimer.current);
    setCopyStatus(message);
    setCopyVisible(true);
    copyTimer.current = window.setTimeout(() => setCopyVisible(false), 3000);
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('vusdo91@gmail.com');
      showCopyStatus('메일주소가 복사되었습니다.');
    } catch {
      showCopyStatus('메일주소를 복사하지 못했습니다. 다시 시도해 주세요.');
    }
  };
  return (
    <ContactContainer>
      <ContactInfo>
        <ContactItem as="button" type="button" onClick={copyEmail} aria-label="메일주소 복사" aria-describedby="contact-email-tooltip">
          <MailIcon className="contact-icon" aria-hidden="true" />
          <span id="contact-email-tooltip" role="tooltip">메일주소 복사</span>
        </ContactItem>
        <ContactItem href="https://instagram.com/limyunmook" target="_blank" rel="noopener noreferrer" aria-label="Instagram 방문" aria-describedby="contact-instagram-tooltip">
          <InstagramIcon className="contact-icon" aria-hidden="true" />
          <span id="contact-instagram-tooltip" role="tooltip">작가 인스타그램 채널로 이동</span>
        </ContactItem>
      </ContactInfo>
      <CopyStatus role="status" aria-atomic="true" $visible={copyVisible}>{copyStatus}</CopyStatus>
    </ContactContainer>
  );
};

export default Contact;
