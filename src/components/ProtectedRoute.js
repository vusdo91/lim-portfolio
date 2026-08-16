import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
`;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useFirebaseAuth();

  if (isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
