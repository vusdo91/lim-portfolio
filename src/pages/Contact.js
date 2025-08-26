import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';
import { IoCall, IoMail, IoLogoInstagram } from 'react-icons/io5';

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
  
  .contact-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: #2d2d2d;
  }
`;

const Contact = () => {
  const { language } = useLanguage();
  
  return (
    <ContactContainer>
      <ContactContent>
        
        <ContactInfo>
          <ContactItem>
            <IoCall className="contact-icon" />
            010-5164-5628
          </ContactItem>
          <ContactItem>
            <IoMail className="contact-icon" />
            vusdo91@gmail.com
          </ContactItem>
          <ContactItem>
            <IoLogoInstagram className="contact-icon" />
            instagram.com/limyunmook
          </ContactItem>
        </ContactInfo>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;