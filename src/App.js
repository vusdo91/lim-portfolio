import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ArtworkProvider } from './contexts/ArtworkContext';
import { ProfileProvider } from './contexts/ProfileContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ArtworkManagement from './pages/admin/ArtworkManagement';
import ArtworkForm from './pages/admin/ArtworkForm';
import ProfileManagement from './pages/admin/ProfileManagement';
import BiographyEdit from './pages/admin/BiographyEdit';
import ExhibitionForm from './pages/admin/ExhibitionForm';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .creato-light {
    font-family: 'CreatoDisplay Light', 'Helvetica Neue', Arial, sans-serif !important;
    font-weight: 300;
  }
  
  .noto-sans {
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  .noto-light {
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 300;
  }
  
  .noto-regular {
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 400;
  }
  
  .noto-medium {
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500;
  }
  
  .noto-bold {
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 700;
  }
`;

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  height: calc(100vh - 56px);
  margin-top: 56px;
  overflow-y: auto;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    height: calc(100vh - 150px);
    margin-top: 70px;
    padding: 0;
  }
`;

const ContentWrapper = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const PageContent = styled.div`
  flex: 1;
`;

function App() {
  return (
    <AuthProvider>
      <ArtworkProvider>
        <ProfileProvider>
          <LanguageProvider>
            <Router>
              <GlobalStyle />
              <Routes>
            {/* 일반 사이트 라우트 */}
            <Route path="/" element={
              <AppContainer>
                <Header />
                <MainContent>
                  <ContentWrapper>
                    <PageContent>
                      <Home />
                    </PageContent>
                    <Footer />
                  </ContentWrapper>
                </MainContent>
              </AppContainer>
            } />
            <Route path="/about" element={
              <AppContainer>
                <Header />
                <MainContent>
                  <ContentWrapper>
                    <PageContent>
                      <About />
                    </PageContent>
                    <Footer />
                  </ContentWrapper>
                </MainContent>
              </AppContainer>
            } />
            <Route path="/works" element={
              <AppContainer>
                <Header />
                <MainContent>
                  <ContentWrapper>
                    <PageContent>
                      <Works />
                    </PageContent>
                    <Footer />
                  </ContentWrapper>
                </MainContent>
              </AppContainer>
            } />
            <Route path="/contact" element={
              <AppContainer>
                <Header />
                <MainContent>
                  <ContentWrapper>
                    <PageContent>
                      <Contact />
                    </PageContent>
                    <Footer />
                  </ContentWrapper>
                </MainContent>
              </AppContainer>
            } />
            
            {/* 관리자 라우트 */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/artwork" element={
              <ProtectedRoute>
                <ArtworkManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/artwork/add" element={
              <ProtectedRoute>
                <ArtworkForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/artwork/edit/:id" element={
              <ProtectedRoute>
                <ArtworkForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute>
                <ProfileManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile/biography/edit" element={
              <ProtectedRoute>
                <BiographyEdit />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile/exhibition/add" element={
              <ProtectedRoute>
                <ExhibitionForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile/exhibition/edit/:id" element={
              <ProtectedRoute>
                <ExhibitionForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </LanguageProvider>
    </ProfileProvider>
  </ArtworkProvider>
</AuthProvider>
  );
}

export default App;
