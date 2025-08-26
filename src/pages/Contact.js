import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';

const ContactContainer = styled.div`
  min-height: calc(100vh - 112px);
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  padding-bottom: 8rem;
  
  @media (max-width: 768px) {
    min-height: calc(100vh - 130px);
  }
`;

const ContactContent = styled.div`
  max-width: 500px;
`;

const TitleSection = styled.div`
  margin-bottom: 3rem;
  
  h1 {
    font-size: 4rem;
    line-height: 3.2rem;
    color: #333;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.1rem;
    
    &.name-title {
      color: #32430D;
    }
    
    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }
`;


const ContactDescription = styled.div`
  margin-bottom: 4rem;
  
  p {
    font-size: 1rem;
    color: #505050;
    line-height: 1;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 3rem;
    
    p {
      font-size: 1rem;
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1rem;
  color: #333;
  
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    background: transparent;
    border-radius: 2px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-position: center;
  }
  
  &:nth-child(1)::before {
    background-image: url('/assets/svg/mobileIcon.svg');
    background-size: 20px 20px;
    filter: invert(15%) sepia(100%) saturate(500%) hue-rotate(75deg) brightness(0.4) contrast(1.2);
  }
  
  &:nth-child(2)::before {
    background-image: url('/assets/svg/mailIcon.svg');
    background-size: 19px 19px;
    filter: invert(15%) sepia(100%) saturate(500%) hue-rotate(75deg) brightness(0.4) contrast(1.2);
  }
  
  &:nth-child(3)::before {
    background-image: url('/assets/svg/instagramIcon.svg');
    background-size: 21px 21px;
    filter: invert(15%) sepia(100%) saturate(500%) hue-rotate(75deg) brightness(0.4) contrast(1.2);
  }
`;

const Contact = () => {
  const { language } = useLanguage();
  
  return (
    <ContactContainer>
      <ContactContent>
        <TitleSection>
          <h1 className="coolvetica">{t('contact.title', language)}</h1>
          <h1 className="name-title coolvetica">{t('contact.name', language)}</h1>
        </TitleSection>
        
        <ContactDescription>
          <p>{t('contact.description.line1', language)}</p>
          <p>{t('contact.description.line2', language)}</p>
        </ContactDescription>
        
        <ContactInfo>
          <ContactItem>010-5164-5628</ContactItem>
          <ContactItem>vusdo91@gmail.com</ContactItem>
          <ContactItem>instagram.com/limyunmook</ContactItem>
        </ContactInfo>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;