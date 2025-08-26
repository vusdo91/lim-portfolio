import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  background: #32430D;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem 2rem;
    text-align: center;
    min-height: 60px;
    height: auto;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
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
  
  &::before {
    content: '';
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: block;
  }
  
  &:first-child::before {
    background: url('/assets/svg/mobileIcon.svg') center/cover no-repeat;
  }
  
  &:nth-child(2)::before {
    background: url('/assets/svg/mailIcon.svg') center/cover no-repeat;
  }
  
  &:nth-child(3)::before {
    background: url('/assets/svg/instagramIcon.svg') center/cover no-repeat;
  }
`;

const Copyright = styled.div`
  font-size: 0.8rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <ContactInfo>
        <ContactItem href="tel:010-5164-5628">010-5164-5628</ContactItem>
        <ContactItem href="mailto:vusdo91@gmail.com">vusdo91@gmail.com</ContactItem>
        <ContactItem href="https://instagram.com/limyunmook" target="_blank" rel="noopener noreferrer">instagram.com/limyunmook</ContactItem>
      </ContactInfo>
      
      <Copyright>
        Copyright 2025, Limyunmook All pictures cannot be copied without permission.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;