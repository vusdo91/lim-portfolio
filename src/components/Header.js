import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';
import { IoLanguage, IoCheckmark } from 'react-icons/io5';

const HeaderContainer = styled.header`
  width: 100%;
  height: 56px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  
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
    color: #2d2d2d;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 3rem;
  
  @media (max-width: 768px) {
    display: none;
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
      background: #2d2d2d;
      border-radius: 2px;
    }
  `}
  
  /* Hover 상태 - 초록 배경 */
  &:hover {
    background: #2d2d2d;
    color: white;
    
    /* hover 시에는 밑줄 제거 */
    &::after {
      display: none;
    }
  }
`;

const LanguageContainer = styled.div`
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
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
  
  .language-icon {
    font-size: 18px;
    color: #1e1e1e;
    transition: color 0.2s ease;
  }
  
  &:hover {
    background: #2d2d2d;
    color: white;
    border-color: #2d2d2d;
    
    .language-icon {
      color: white;
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
    background: #2d2d2d;
    color: white;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const HamburgerLine = styled.span`
  width: 20px;
  height: 2px;
  background: #333;
  margin: 2px 0;
  transition: all 0.3s ease;
  
  ${props => props.isOpen && props.first && `
    transform: rotate(45deg) translate(4px, 4px);
  `}
  
  ${props => props.isOpen && props.second && `
    opacity: 0;
  `}
  
  ${props => props.isOpen && props.third && `
    transform: rotate(-45deg) translate(4px, -4px);
  `}
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 999;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transform: translateY(${props => props.show ? '0' : '-10px'});
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuContent = styled.div`
  height: 100%;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MobileNavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 2rem;
`;

const MobileNavLink = styled(Link)`
  font-size: 1.5rem;
  color: #333;
  text-decoration: none;
  padding: 1rem 0;
  transition: color 0.2s ease;
  font-family: 'CreatoDisplay Light', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  &:hover {
    color: #2d2d2d;
  }
  
  ${props => props.$isActive && `
    color: #2d2d2d;
  `}
  
  .check-icon {
    font-size: 20px;
    color: #2d2d2d;
  }
`;

const MobileLanguageSection = styled.div`
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;
`;

const MobileLanguageTitle = styled.div`
  font-size: 1rem;
  color: #666;
  font-family: 'CreatoDisplay Light', 'Helvetica Neue', Arial, sans-serif;
  flex-shrink: 0;
`;

const MobileLanguageOptions = styled.div`
  display: flex;
  gap: 1rem;
`;

const MobileLanguageButton = styled.button`
  background: none;
  border: 1px solid #eee;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f8f8;
  }
  
  ${props => props.active && `
    background: #2d2d2d;
    color: white;
    border-color: #2d2d2d;
  `}
`;

const Header = () => {
  const location = useLocation();
  const { language, switchLanguage } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('button')) {
        setIsMobileMenuOpen(false);
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
  
  const handleMobileLanguageSelect = (selectedLang) => {
    switchLanguage(selectedLang.code);
    setIsMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <>
      <HeaderContainer>
        <Logo to="/" className="creato-light">
          <span className="studio">Studio</span> <span className="name">LimYunmook</span>
        </Logo>
        
        <Navigation className="creato-light">
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
            <IoLanguage className="language-icon" />
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
        
        <HamburgerButton onClick={toggleMobileMenu}>
          <HamburgerLine isOpen={isMobileMenuOpen} first />
          <HamburgerLine isOpen={isMobileMenuOpen} second />
          <HamburgerLine isOpen={isMobileMenuOpen} third />
        </HamburgerButton>
      </HeaderContainer>
      
      <MobileMenu show={isMobileMenuOpen} ref={mobileMenuRef}>
        <MobileMenuContent>
          <MobileNavSection>
            <MobileNavLink 
              to="/about" 
              $isActive={location.pathname === '/about'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navigation.about', language)}
              {location.pathname === '/about' && <IoCheckmark className="check-icon" />}
            </MobileNavLink>
            <MobileNavLink 
              to="/works" 
              $isActive={location.pathname === '/works'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navigation.works', language)}
              {location.pathname === '/works' && <IoCheckmark className="check-icon" />}
            </MobileNavLink>
            <MobileNavLink 
              to="/contact" 
              $isActive={location.pathname === '/contact'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navigation.contact', language)}
              {location.pathname === '/contact' && <IoCheckmark className="check-icon" />}
            </MobileNavLink>
          </MobileNavSection>
          
          <MobileLanguageSection>
            <MobileLanguageTitle>Language</MobileLanguageTitle>
            <MobileLanguageOptions>
              {languages.map((lang) => (
                <MobileLanguageButton
                  key={lang.code}
                  active={language === lang.code}
                  onClick={() => handleMobileLanguageSelect(lang)}
                >
                  {lang.name}
                </MobileLanguageButton>
              ))}
            </MobileLanguageOptions>
          </MobileLanguageSection>
        </MobileMenuContent>
      </MobileMenu>
    </>
  );
};

export default Header;