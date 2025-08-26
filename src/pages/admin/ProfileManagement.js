import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';

const Container = styled.div`
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

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
  
  &.primary {
    background: #32430D;
    color: white;
    
    &:hover {
      background: #2a3a0b;
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  }
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin: 0;
  font-size: 1.3rem;
`;

const SectionContent = styled.div`
  padding: 2rem;
`;

const BiographyText = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
`;

const ExhibitionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
  }
  
  tr:hover {
    background: #f8f9fa;
  }
`;

const TypeBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.solo {
    background: #d4edda;
    color: #155724;
  }
  
  &.group {
    background: #d1ecf1;
    color: #0c5460;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &.edit {
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  }
  
  &.delete {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const LanguageToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  button {
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    background: white;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s ease;
    
    &.active {
      background: #32430D;
      color: white;
      border-color: #32430D;
    }
    
    &:hover:not(.active) {
      background: #f8f9fa;
    }
  }
  
  span {
    font-size: 0.9rem;
    color: #666;
  }
`;

const BiographyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LanguageLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
`;

const ProfileManagement = () => {
  const navigate = useNavigate();
  const { profile, deleteExhibition, isLoading } = useProfile();
  const [deletingId, setDeletingId] = useState(null);
  const [viewLanguage, setViewLanguage] = useState('ko');

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleEditBiography = () => {
    navigate('/admin/profile/biography/edit');
  };

  const handleAddExhibition = () => {
    navigate('/admin/profile/exhibition/add');
  };

  const handleEditExhibition = (id) => {
    navigate(`/admin/profile/exhibition/edit/${id}`);
  };

  const handleDeleteExhibition = async (id) => {
    if (window.confirm('정말 이 전시 기록을 삭제하시겠습니까?')) {
      setDeletingId(id);
      try {
        deleteExhibition(id);
      } catch (error) {
        console.error('전시 기록 삭제 중 오류:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // 전시를 연도별, 타입별로 정렬
  const sortedExhibitions = [...profile.exhibitions].sort((a, b) => {
    if (a.year !== b.year) {
      return parseInt(b.year) - parseInt(a.year); // 최신 연도 먼저
    }
    if (a.type !== b.type) {
      return a.type === 'solo' ? -1 : 1; // 개인전 먼저
    }
    return 0;
  });

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>프로필 관리</Title>
        </Header>
        <Content>
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>로딩 중...</p>
          </div>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>프로필 관리</Title>
        <HeaderButtons>
          <Button className="secondary" onClick={handleBackToDashboard}>
            대시보드로 돌아가기
          </Button>
        </HeaderButtons>
      </Header>
      
      <Content>
        {/* 소개문 섹션 */}
        <Section>
          <SectionHeader>
            <SectionTitle>작가 소개문</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <LanguageToggle>
                <span>언어:</span>
                <button 
                  className={viewLanguage === 'ko' ? 'active' : ''} 
                  onClick={() => setViewLanguage('ko')}
                >
                  한국어
                </button>
                <button 
                  className={viewLanguage === 'en' ? 'active' : ''} 
                  onClick={() => setViewLanguage('en')}
                >
                  English
                </button>
              </LanguageToggle>
              <Button className="primary" onClick={handleEditBiography}>
                편집
              </Button>
            </div>
          </SectionHeader>
          <SectionContent>
            <BiographyContainer>
              {viewLanguage === 'ko' ? (
                <div>
                  <LanguageLabel>한국어</LanguageLabel>
                  <BiographyText>
                    {profile.biography || '한국어 소개문이 작성되지 않았습니다.'}
                  </BiographyText>
                </div>
              ) : (
                <div>
                  <LanguageLabel>English</LanguageLabel>
                  <BiographyText>
                    {profile.biography_en || 'English biography has not been written.'}
                  </BiographyText>
                </div>
              )}
            </BiographyContainer>
          </SectionContent>
        </Section>

        {/* 전시 목록 섹션 */}
        <Section>
          <SectionHeader>
            <SectionTitle>전시 목록 ({profile.exhibitions.length}개)</SectionTitle>
            <Button className="primary" onClick={handleAddExhibition}>
              전시 추가
            </Button>
          </SectionHeader>
          <SectionContent>
            {sortedExhibitions.length === 0 ? (
              <EmptyState>
                <h3>등록된 전시가 없습니다</h3>
                <p>첫 번째 전시를 추가해보세요!</p>
                <Button className="primary" onClick={handleAddExhibition}>
                  전시 추가하기
                </Button>
              </EmptyState>
            ) : (
              <ExhibitionTable>
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>연도</th>
                    <th>전시명 (한국어)</th>
                    <th>전시명 (English)</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExhibitions.map((exhibition) => (
                    <tr key={exhibition.id}>
                      <td>
                        <TypeBadge className={exhibition.type}>
                          {exhibition.type === 'solo' ? '개인전' : '그룹전'}
                        </TypeBadge>
                      </td>
                      <td>{exhibition.year}</td>
                      <td>{exhibition.name}</td>
                      <td>{exhibition.name_en || '영문명 없음'}</td>
                      <td>
                        <ActionButtons>
                          <SmallButton 
                            className="edit" 
                            onClick={() => handleEditExhibition(exhibition.id)}
                          >
                            수정
                          </SmallButton>
                          <SmallButton 
                            className="delete" 
                            onClick={() => handleDeleteExhibition(exhibition.id)}
                            disabled={deletingId === exhibition.id}
                          >
                            {deletingId === exhibition.id ? '삭제 중...' : '삭제'}
                          </SmallButton>
                        </ActionButtons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ExhibitionTable>
            )}
          </SectionContent>
        </Section>
      </Content>
    </Container>
  );
};

export default ProfileManagement;