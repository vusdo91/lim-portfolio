import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 1rem;

  @media (max-width: 600px) {
    padding: 1rem;
    gap: 0.5rem;
  }
`;

const HeaderSpacer = styled.div`
  height: 62px;
  flex: 0 0 62px;
`;

const Side = styled.div`
  min-width: 0;

  &:last-child {
    justify-self: end;
  }
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
  font-size: 1.5rem;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #5a6268;
  }

  @media (max-width: 600px) {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
`;

const AdminPageHeader = ({ title, backTo, onBack, actions }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (backTo) navigate(backTo);
  };

  return (
    <>
      <Header>
        <Side>
          {backTo && (
            <BackButton type="button" onClick={handleBack} aria-label="뒤로가기">
              ← 뒤로가기
            </BackButton>
          )}
        </Side>
        <Title>{title}</Title>
        <Side>{actions}</Side>
      </Header>
      <HeaderSpacer aria-hidden="true" />
    </>
  );
};

export default AdminPageHeader;
