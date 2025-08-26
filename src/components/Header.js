import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';

const HeaderContainer = styled.header`
  width: 100%;
  height: 56px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (max-width: 768px) {
    height: 70px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  letter-spacing: 0.045em;
  
  .studio {
    color: #000;
  }
  
  .name {
    color: #32430D;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 3rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const NavLink = styled(Link)`
  font-size: 1rem;
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  position: relative;
  transition: all 0.2s ease;
  
  /* Active 상태 - 밑줄 */
  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 4px;
      background: #32430D;
      border-radius: 2px;
    }
  `}
  
  /* Hover 상태 - 초록 배경 */
  &:hover {
    background: #32430D;
    color: white;
    
    /* hover 시에는 밑줄 제거 */
    &::after {
      display: none;
    }
  }
`;

const LanguageContainer = styled.div`
  position: relative;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  background: white;
  border: transparent;
  border-radius: 16px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 400;
  color: #1e1e1e;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100px;
  
  &::before {
    content: '';
    width: 18px;
    height: 18px;
    background: url('/assets/svg/languageIcon.svg') center/cover;
    display: inline-block;
    filter: invert(15%) sepia(100%) saturate(500%) hue-rotate(75deg) brightness(0.4) contrast(1.2);
    transition: filter 0.2s ease;
  }
  
  &:hover {
    background: #32430D;
    color: white;
    border-color: #32430D;
    
    &::before {
      filter: invert(1);
    }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transform: translateY(${props => props.show ? '0' : '-10px'});
  transition: all 0.2s ease;
  z-index: 1000;
  min-width: 120px;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.8rem;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f8f8f8;
  }
  
  &.active {
    background: #32430D;
    color: white;
  }
`;

const Header = () => {
  const location = useLocation();
  const { language, switchLanguage } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const languages = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' }
  ];
  
  const currentLanguageName = languages.find(lang => lang.code === language)?.name || '한국어';
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLanguageSelect = (selectedLang) => {
    switchLanguage(selectedLang.code);
    setIsDropdownOpen(false);
  };
  
  return (
    <HeaderContainer>
      <Logo to="/" className="coolvetica">
        <span className="studio">Studio</span> <span className="name">LimYunmook</span>
      </Logo>
      
      <Navigation className="coolvetica">
        <NavLink to="/about" $isActive={location.pathname === '/about'}>
          {t('navigation.about', language)}
        </NavLink>
        <NavLink to="/works" $isActive={location.pathname === '/works'}>
          {t('navigation.works', language)}
        </NavLink>
        <NavLink to="/contact" $isActive={location.pathname === '/contact'}>
          {t('navigation.contact', language)}
        </NavLink>
      </Navigation>
      
      <LanguageContainer ref={dropdownRef}>
        <LanguageButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {currentLanguageName}
        </LanguageButton>
        <DropdownMenu show={isDropdownOpen}>
          {languages.map((lang) => (
            <DropdownItem
              key={lang.code}
              className={language === lang.code ? 'active' : ''}
              onClick={() => handleLanguageSelect(lang)}
            >
              {lang.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </LanguageContainer>
    </HeaderContainer>
  );
};

export default Header;