import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useArtworks } from '../../contexts/ArtworkContext';
import AdminPageHeader from './AdminPageHeader';
import YearFilter, { getYearOptions } from '../../components/YearFilter';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  overflow-y: auto;
  height: 100vh;
`;

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
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
  
  &.danger {
    background: #2d2d2d;
    color: white;
    
    &:hover {
      background: #1a1a1a;
    }
  }
`;

const ManagementToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;

  > [aria-label='작품 연도 필터'] {
    margin-bottom: 0;
  }

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const ArtworkCount = styled.p`
  margin: 0 0 0.75rem;
  color: #555;
  font-size: 0.95rem;
`;

const ViewButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.$active ? '#2d2d2d' : '#ccc'};
  border-radius: 4px;
  background: ${props => props.$active ? '#2d2d2d' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#333'};
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
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

const ArtworkTableWrapper = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ArtworkTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid #e5e5e5;
    color: #333;
    vertical-align: middle;
  }

  th {
    background: #f8f8f8;
    font-weight: 600;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody tr:hover {
    background: #f8f8f8;
  }
`;

const TableActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ImagePreview = styled.img`
  position: fixed;
  z-index: 1000;
  left: ${props => props.$left}px;
  top: ${props => props.$top}px;
  width: 240px;
  height: 180px;
  object-fit: contain;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  pointer-events: none;
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
    background: #525252;
    color: white;
    
    &:hover {
      background: #2d2d2d;
    }
  }
  
  &.delete {
    background: #2d2d2d;
    color: white;
    
    &:hover {
      background: #1a1a1a;
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
  const [selectedYear, setSelectedYear] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  const [imagePreview, setImagePreview] = useState(null);
  const yearOptions = useMemo(() => getYearOptions(artworks), [artworks]);
  const matchingArtworks = selectedYear === 'all'
    ? artworks
    : artworks.filter(artwork => String(artwork.year || '').trim() === selectedYear);

  useEffect(() => {
    if (!yearOptions.includes(selectedYear)) setSelectedYear('all');
  }, [selectedYear, yearOptions]);

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
        const result = await deleteArtwork(id);
        if (!result.success) {
          alert('작품 삭제에 실패했습니다: ' + result.error);
        }
      } catch (error) {
        console.error('작품 삭제 중 오류:', error);
        alert('작품 삭제 중 오류가 발생했습니다.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const showImagePreview = (event, artwork) => {
    if (!artwork.image) return;
    const previewWidth = 240;
    const previewHeight = 180;
    const left = Math.min(event.clientX + 16, window.innerWidth - previewWidth - 12);
    const top = Math.min(event.clientY + 16, window.innerHeight - previewHeight - 12);
    setImagePreview({ image: artwork.image, left: Math.max(12, left), top: Math.max(12, top) });
  };

  const renderArtworkActions = artwork => (
    <TableActions>
      <SmallButton className="edit" onClick={() => handleEditArtwork(artwork.id)}>
        수정
      </SmallButton>
      <SmallButton
        className="delete"
        onClick={() => handleDeleteArtwork(artwork.id)}
        disabled={deletingId === artwork.id}
      >
        {deletingId === artwork.id ? '삭제 중...' : '삭제'}
      </SmallButton>
    </TableActions>
  );

  if (isLoading) {
    return (
      <Container>
        <AdminPageHeader title="작품 관리" backTo="/admin/dashboard" />
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
      <AdminPageHeader
        title="작품 관리"
        backTo="/admin/dashboard"
      />
      
      <Content>
        <ArtworkCount>현재 등록된 작품 수: {artworks.length}개</ArtworkCount>
        <ManagementToolbar>
          <YearFilter
            years={yearOptions}
            selectedYear={selectedYear}
            onSelect={setSelectedYear}
          />
          <HeaderButtons>
            <ViewButton
              type="button"
              aria-pressed={viewMode === 'cards'}
              $active={viewMode === 'cards'}
              onClick={() => {
                setViewMode('cards');
                setImagePreview(null);
              }}
            >
              카드 보기
            </ViewButton>
            <ViewButton
              type="button"
              aria-pressed={viewMode === 'table'}
              $active={viewMode === 'table'}
              onClick={() => setViewMode('table')}
            >
              테이블 보기
            </ViewButton>
            <Button className="primary" onClick={handleAddArtwork}>
              작품 추가
            </Button>
          </HeaderButtons>
        </ManagementToolbar>
        {matchingArtworks.length === 0 ? (
          <EmptyState>
            {artworks.length === 0 ? (
              <>
                <h2>등록된 작품이 없습니다</h2>
                <p>첫 번째 작품을 추가해보세요!</p>
                <Button className="primary" onClick={handleAddArtwork}>작품 추가하기</Button>
              </>
            ) : (
              <>
                <h2>해당 연도에 등록된 작품이 없습니다</h2>
                <p>다른 연도를 선택해 주세요.</p>
              </>
            )}
          </EmptyState>
        ) : (
          viewMode === 'cards' ? (
            <ArtworkGrid>
              {matchingArtworks.map(artwork => (
                <ArtworkCard key={artwork.id}>
                  <ArtworkImage
                    src={artwork.image}
                    alt={artwork.title}
                    onError={event => {
                      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
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
                    <CardActions>{renderArtworkActions(artwork)}</CardActions>
                  </ArtworkInfo>
                </ArtworkCard>
              ))}
            </ArtworkGrid>
          ) : (
            <>
              <ArtworkTableWrapper>
                <ArtworkTable>
                  <thead>
                    <tr>
                      <th scope="col">작품명</th>
                      <th scope="col">연도</th>
                      <th scope="col">크기</th>
                      <th scope="col">재료</th>
                      <th scope="col">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchingArtworks.map(artwork => (
                      <tr
                        key={artwork.id}
                        onMouseEnter={event => showImagePreview(event, artwork)}
                        onMouseMove={event => showImagePreview(event, artwork)}
                        onMouseLeave={() => setImagePreview(null)}
                      >
                        <td>{artwork.title}</td>
                        <td>{artwork.year}</td>
                        <td>{artwork.size}</td>
                        <td>{artwork.material}</td>
                        <td>{renderArtworkActions(artwork)}</td>
                      </tr>
                    ))}
                  </tbody>
                </ArtworkTable>
              </ArtworkTableWrapper>
              {imagePreview && (
                <ImagePreview
                  src={imagePreview.image}
                  alt=""
                  $left={imagePreview.left}
                  $top={imagePreview.top}
                />
              )}
            </>
          )
        )}
      </Content>
    </Container>
  );
};

export default ArtworkManagement;