import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledNav = styled.nav`
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const NavLogo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #007bff;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s;
  background-color: ${props => props.$active ? '#007bff' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#333'};

  &:hover {
    background-color: ${props => props.$active ? '#007bff' : '#f8f9fa'};
    color: ${props => props.$active ? 'white' : '#007bff'};
  }

  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
  }
`;

const Navigation = () => {
  const location = useLocation();

  return (
    <StyledNav>
      <NavContainer>
        <NavLogo to="/">
          Portfolio
        </NavLogo>
        <NavMenu>
          <NavItem>
            <NavLink 
              to="/" 
              $active={location.pathname === '/'}
            >
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              to="/about" 
              $active={location.pathname === '/about'}
            >
              About
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              to="/works" 
              $active={location.pathname === '/works'}
            >
              Works
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              to="/contact" 
              $active={location.pathname === '/contact'}
            >
              Contact
            </NavLink>
          </NavItem>
        </NavMenu>
      </NavContainer>
    </StyledNav>
  );
};

export default Navigation;