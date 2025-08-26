import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useArtworks } from '../../contexts/ArtworkContext';
import { useProfile } from '../../contexts/ProfileContext';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
  font-size: 1.5rem;
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #c82333;
  }
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const MenuCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MenuTitle = styled.h3`
  color: #32430D;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const MenuDescription = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #32430D;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const StatDescription = styled.div`
  color: #888;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { artworks, isLoading: artworksLoading } = useArtworks();
  const { profile, isLoading: profileLoading } = useProfile();

  const handleLogout = () => {
    logout();
  };

  // 통계 데이터 계산
  const stats = {
    artworks: artworks?.length || 0,
    exhibitions: profile?.exhibitions?.length || 0,
    soloExhibitions: profile?.exhibitions?.filter(ex => ex.type === 'solo').length || 0,
    groupExhibitions: profile?.exhibitions?.filter(ex => ex.type === 'group').length || 0,
    hasBiography: !!(profile?.biography || profile?.biography_en)
  };

  const isLoading = artworksLoading || profileLoading;

  return (
    <DashboardContainer>
      <Header>
        <Title>관리자 대시보드</Title>
        <LogoutButton onClick={handleLogout}>
          로그아웃
        </LogoutButton>
      </Header>
      
      <Content>
        <WelcomeCard>
          <h2>환영합니다!</h2>
          <p>Studio LimYunmook 관리자 페이지에 오신 것을 환영합니다.</p>
        </WelcomeCard>

        {/* 통계 정보 */}
        {isLoading ? (
          <LoadingMessage>데이터 로딩 중...</LoadingMessage>
        ) : (
          <StatsGrid>
            <StatCard>
              <StatNumber>{stats.artworks}</StatNumber>
              <StatLabel>등록된 작품</StatLabel>
              <StatDescription>총 작품 수</StatDescription>
            </StatCard>
            
            <StatCard>
              <StatNumber>{stats.exhibitions}</StatNumber>
              <StatLabel>전체 전시</StatLabel>
              <StatDescription>개인전 {stats.soloExhibitions}개 + 그룹전 {stats.groupExhibitions}개</StatDescription>
            </StatCard>
            
            <StatCard>
              <StatNumber>{stats.soloExhibitions}</StatNumber>
              <StatLabel>개인전</StatLabel>
              <StatDescription>Solo Exhibitions</StatDescription>
            </StatCard>
            
            <StatCard>
              <StatNumber>{stats.groupExhibitions}</StatNumber>
              <StatLabel>그룹전</StatLabel>
              <StatDescription>Group Exhibitions</StatDescription>
            </StatCard>
            
            <StatCard>
              <StatNumber>{stats.hasBiography ? '✓' : '✗'}</StatNumber>
              <StatLabel>작가 소개문</StatLabel>
              <StatDescription>
                {stats.hasBiography 
                  ? (profile?.biography && profile?.biography_en ? '한글/영문 모두 작성됨' : '일부 언어만 작성됨')
                  : '작성되지 않음'
                }
              </StatDescription>
            </StatCard>
          </StatsGrid>
        )}
        
        <MenuGrid>
          <MenuCard onClick={() => window.location.href = '/admin/artwork'}>
            <MenuTitle>작품 관리</MenuTitle>
            <MenuDescription>
              작품 추가, 수정, 삭제 및 정보 관리
            </MenuDescription>
          </MenuCard>
          
          <MenuCard onClick={() => window.location.href = '/admin/profile'}>
            <MenuTitle>프로필 관리</MenuTitle>
            <MenuDescription>
              작가 소개문 및 전시 목록 관리
            </MenuDescription>
          </MenuCard>
        </MenuGrid>
      </Content>
    </DashboardContainer>
  );
};

export default AdminDashboard;