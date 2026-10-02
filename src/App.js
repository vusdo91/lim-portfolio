import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { LanguageProvider } from './contexts/LanguageContext';
import { FirebaseAuthProvider } from './contexts/FirebaseAuthContext';
import { ArtworkProvider } from './contexts/ArtworkContext';
import { ProfileProvider } from './contexts/ProfileContext';
import SiteHeader from './components/SiteHeader';
import { PageTransitionProvider } from './components/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import IndexPrototype from './pages/IndexPrototype';
import ArchivePrototype from './pages/ArchivePrototype';
import ArtworkDetail from './pages/ArtworkDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ArtworkManagement from './pages/admin/ArtworkManagement';
import ArtworkForm from './pages/admin/ArtworkForm';
import ProfileManagement from './pages/admin/ProfileManagement';
import BiographyEdit from './pages/admin/BiographyEdit';
import ExhibitionForm from './pages/admin/ExhibitionForm';
import HomeManagement from './pages/admin/HomeManagement';
import HomeExhibitionForm from './pages/admin/HomeExhibitionForm';
import HomeArtworkForm from './pages/admin/HomeArtworkForm';
import AwardForm from './pages/admin/AwardForm';
import VisitorTracker from './components/VisitorTracker';

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
const AboutAppContainer = styled(AppContainer)`
  &, * { font-family: 'Pretendard Variable', Pretendard, sans-serif !important; }
`;

const MainContent = styled.main`
  flex: 1;
  height: calc(100vh - 64px);
  padding-top: 32px;
  overflow-y: auto;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    height: calc(100vh - 105px);
    padding-top: 52.5px;
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

function LegacyWorksDetailRedirect() {
  const { artworkId } = useParams();
  return <Navigate to={`/works/${encodeURIComponent(artworkId)}`} replace />;
}

function App() {
  return (
    <FirebaseAuthProvider>
      <ArtworkProvider>
        <ProfileProvider>
          <LanguageProvider>
            <Router>
              <GlobalStyle />
              <VisitorTracker />
              <PageTransitionProvider>
              <Routes>
            {/* 일반 사이트 라우트 */}
            <Route path="/" element={<IndexPrototype />} />
            <Route path="/index-prototype" element={<Navigate to="/" replace />} />
            <Route path="/archive-prototype" element={<Navigate to="/works" replace />} />
            <Route path="/archive-prototype/:artworkId" element={<LegacyWorksDetailRedirect />} />
            <Route path="/works" element={<ArchivePrototype />} />
            <Route path="/works/:artworkId" element={<ArtworkDetail />} />
            <Route path="/about" element={
              <AboutAppContainer>
                <MainContent>
                  <SiteHeader />
                  <ContentWrapper>
                    <PageContent>
                      <About />
                    </PageContent>
                  </ContentWrapper>
                </MainContent>
              </AboutAppContainer>
            } />
            <Route path="/contact" element={
              <AppContainer>
                <MainContent>
                  <SiteHeader />
                  <ContentWrapper>
                    <PageContent>
                      <Contact />
                    </PageContent>
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
            <Route path="/admin/home" element={
              <ProtectedRoute>
                <HomeManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/home/exhibition" element={
              <ProtectedRoute>
                <HomeExhibitionForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/home/artworks" element={
              <ProtectedRoute>
                <HomeArtworkForm />
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
            <Route path="/admin/profile/award/add" element={
              <ProtectedRoute>
                <AwardForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile/award/edit/:id" element={
              <ProtectedRoute>
                <AwardForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
          </PageTransitionProvider>
        </Router>
      </LanguageProvider>
    </ProfileProvider>
  </ArtworkProvider>
</FirebaseAuthProvider>
  );
}

export default App;
