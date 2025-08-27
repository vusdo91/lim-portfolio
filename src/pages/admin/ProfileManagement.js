import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  overflow-y: auto;
  height: 100vh;
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
    background: #2d2d2d;
    color: white;
    
    &:hover {
      background: #1a1a1a;
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
  background: #f5f5f5;
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
  font-size: 0.85rem;
  table-layout: fixed;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background: #f5f5f5;
    font-weight: 600;
    color: #333;
    font-size: 0.8rem;
  }
  
  td {
    font-size: 0.85rem;
  }
  
  tr:hover {
    background: #f5f5f5;
  }
  
  /* 컬럼 너비 설정 */
  th:nth-child(1), td:nth-child(1) { width: 60px; }   /* 구분 */
  th:nth-child(2), td:nth-child(2) { width: 60px; }   /* 연도 */
  th:nth-child(3), td:nth-child(3) { width: 35%; }    /* 한국어 전시명 */
  th:nth-child(4), td:nth-child(4) { width: 35%; }    /* 영문 전시명 */
  th:nth-child(5), td:nth-child(5) { width: 80px; }   /* 관리 */
`;

const TypeBadge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  
  &.solo {
    background: #e3f2fd;
    color: #1565c0;
    border: 1px solid #bbdefb;
  }
  
  &.group {
    background: #f3e5f5;
    color: #7b1fa2;
    border: 1px solid #ce93d8;
  }
`;

const TruncatedText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  title: ${props => props.title || ''};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  padding: 0.4rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  
  &.edit {
    background: #2d2d2d;
    
    &:hover {
      background: #1a1a1a;
      transform: scale(1.1);
    }
    
    svg {
      width: 14px;
      height: 14px;
      fill: white;
    }
  }
  
  &.delete {
    background: #dc3545;
    
    &:hover {
      background: #c82333;
      transform: scale(1.1);
    }
    
    &:disabled {
      background: #f8d7da;
      cursor: not-allowed;
      transform: none;
    }
    
    &::before {
      content: '';
      width: 12px;
      height: 1.5px;
      background: white;
      position: absolute;
      transform: rotate(45deg);
    }
    
    &::after {
      content: '';
      width: 12px;
      height: 1.5px;
      background: white;
      position: absolute;
      transform: rotate(-45deg);
    }
    
    &:disabled::before,
    &:disabled::after {
      background: #721c24;
    }
  }
  
  &.loading {
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      border: 1.5px solid white;
      border-top: 1.5px solid transparent;
      border-radius: 50%;
      position: absolute;
      animation: spin 1s linear infinite;
    }
    
    &::after {
      display: none;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
      background: #2d2d2d;
      color: white;
      border-color: #2d2d2d;
    }
    
    &:hover:not(.active) {
      background: #f5f5f5;
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
                          {exhibition.type === 'solo' ? '개인' : '그룹'}
                        </TypeBadge>
                      </td>
                      <td>{exhibition.year}</td>
                      <td>
                        <TruncatedText title={exhibition.name}>
                          {exhibition.name}
                        </TruncatedText>
                      </td>
                      <td>
                        <TruncatedText title={exhibition.name_en || '영문명 없음'}>
                          {exhibition.name_en || '영문명 없음'}
                        </TruncatedText>
                      </td>
                      <td>
                        <ActionButtons>
                          <IconButton 
                            className="edit" 
                            onClick={() => handleEditExhibition(exhibition.id)}
                            title="수정"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13 2.71754V4.74727H4V19.9703H20V9.82161H22V22H2V2.71754H13ZM21.707 3.43508L8.70703 16.6283L7.29297 15.1933L20.293 2L21.707 3.43508Z" fill="white"/>
                            </svg>
                          </IconButton>
                          <IconButton 
                            className={`delete ${deletingId === exhibition.id ? 'loading' : ''}`}
                            onClick={() => handleDeleteExhibition(exhibition.id)}
                            disabled={deletingId === exhibition.id}
                            title={deletingId === exhibition.id ? '삭제 중...' : '삭제'}
                          />
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