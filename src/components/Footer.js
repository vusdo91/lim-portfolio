import React from 'react';
import styled from 'styled-components';
import { MobileIcon, MailIcon, InstagramIcon } from './icons/SVGIcons';

const FooterContainer = styled.footer`
  width: 100%;
  background: #1a1a1a;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.3rem;
    padding: 1rem 1rem;
    text-align: left;
    height: auto;
    min-height: 80px;
    font-size: 0.7rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
    font-size: 0.6rem;
    margin-bottom: 0.4rem;
  }
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.8rem;
  font-weight: 300;
  line-height: 1.4;
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  .contact-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: white;
  }
`;

const Copyright = styled.div`
  font-size: 0.8rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
    text-align: left;
    margin-top: 0.2rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <ContactInfo>
        <ContactItem href="tel:010-5164-5628">
          <MobileIcon className="contact-icon" />
          010-5164-5628
        </ContactItem>
        <ContactItem href="mailto:vusdo91@gmail.com">
          <MailIcon className="contact-icon" />
          vusdo91@gmail.com
        </ContactItem>
        <ContactItem href="https://instagram.com/limyunmook" target="_blank" rel="noopener noreferrer">
          <InstagramIcon className="contact-icon" />
          instagram.com/limyunmook
        </ContactItem>
      </ContactInfo>
      
      <Copyright>
        Copyright 2025, Limyunmook All pictures cannot be copied without permission.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;