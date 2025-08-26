import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useArtworks } from '../../contexts/ArtworkContext';

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
  
  &.danger {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  }
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ArtworkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ArtworkCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ArtworkImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
`;

const ArtworkInfo = styled.div`
  padding: 1rem;
`;

const ArtworkTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const ArtworkDetails = styled.div`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const CardActions = styled.div`
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
  padding: 4rem 2rem;
  color: #666;
  
  h2 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    margin-bottom: 2rem;
  }
`;

const ArtworkManagement = () => {
  const navigate = useNavigate();
  const { artworks, deleteArtwork, isLoading } = useArtworks();
  const [deletingId, setDeletingId] = useState(null);

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleAddArtwork = () => {
    navigate('/admin/artwork/add');
  };

  const handleEditArtwork = (id) => {
    navigate(`/admin/artwork/edit/${id}`);
  };

  const handleDeleteArtwork = async (id) => {
    if (window.confirm('정말 이 작품을 삭제하시겠습니까?')) {
      setDeletingId(id);
      try {
        deleteArtwork(id);
      } catch (error) {
        console.error('작품 삭제 중 오류:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>작품 관리</Title>
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
        <Title>작품 관리</Title>
        <HeaderButtons>
          <Button className="primary" onClick={handleAddArtwork}>
            작품 추가
          </Button>
          <Button className="secondary" onClick={handleBackToDashboard}>
            대시보드로 돌아가기
          </Button>
        </HeaderButtons>
      </Header>
      
      <Content>
        {artworks.length === 0 ? (
          <EmptyState>
            <h2>등록된 작품이 없습니다</h2>
            <p>첫 번째 작품을 추가해보세요!</p>
            <Button className="primary" onClick={handleAddArtwork}>
              작품 추가하기
            </Button>
          </EmptyState>
        ) : (
          <ArtworkGrid>
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id}>
                <ArtworkImage 
                  src={artwork.image} 
                  alt={artwork.title}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <ArtworkInfo>
                  <ArtworkTitle>{artwork.title}</ArtworkTitle>
                  <ArtworkDetails>
                    <div><strong>크기:</strong> {artwork.size}</div>
                    <div><strong>재료:</strong> {artwork.material}</div>
                    <div><strong>연도:</strong> {artwork.year}</div>
                    {artwork.description && (
                      <div><strong>설명:</strong> {artwork.description.slice(0, 50)}...</div>
                    )}
                  </ArtworkDetails>
                  <CardActions>
                    <SmallButton 
                      className="edit" 
                      onClick={() => handleEditArtwork(artwork.id)}
                    >
                      수정
                    </SmallButton>
                    <SmallButton 
                      className="delete" 
                      onClick={() => handleDeleteArtwork(artwork.id)}
                      disabled={deletingId === artwork.id}
                    >
                      {deletingId === artwork.id ? '삭제 중...' : '삭제'}
                    </SmallButton>
                  </CardActions>
                </ArtworkInfo>
              </ArtworkCard>
            ))}
          </ArtworkGrid>
        )}
      </Content>
    </Container>
  );
};

export default ArtworkManagement;