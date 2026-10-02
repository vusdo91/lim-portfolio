import React from 'react';
import styled from 'styled-components';
import { useArtworks } from '../../contexts/ArtworkContext';
import { useProfile } from '../../contexts/ProfileContext';
import AdminPageHeader from './AdminPageHeader';
import { DEFAULT_HOME_SETTINGS, getHomeArtworkIds } from '../../utils/homeSettings';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background: #f5f5f5;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  gap: 1rem;
`;

const Section = styled.section`
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.15rem;
`;

const ExhibitionText = styled.p`
  margin: 0.75rem 0 0;
  color: #444;
  line-height: 1.5;
`;

const ArtworkHelp = styled.p`
  margin: -0.5rem 0 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const ArtworkList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;
`;

const SaveButton = styled.button`
  padding: 0.55rem 0.9rem;
  border: 0;
  border-radius: 4px;
  background: #2d2d2d;
  color: white;
  font: inherit;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    background: #888;
    cursor: wait;
  }
`;

const ArtworkItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;

  img {
    width: 56px;
    height: 56px;
    flex: 0 0 auto;
    object-fit: cover;
    background: #eee;
  }

  span {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

const HomeManagement = () => {
  const navigate = useNavigate();
  const { artworks, isLoading: artworksLoading } = useArtworks();
  const { profile, isLoading: profileLoading } = useProfile();
  const {
    homeExhibitionTitle,
    homeExhibitionDate,
    homeGalleryName,
    homeArtworkIds
  } = profile;

  const handleEditExhibitionInfo = () => {
    navigate('/admin/home/exhibition');
  };

  const handleEditArtworks = () => {
    navigate('/admin/home/artworks');
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const selectedArtworkIds = getHomeArtworkIds({ homeArtworkIds }, artworks);
  const homeArtworks = artworks.filter(artwork => selectedArtworkIds.includes(String(artwork.id)));

  return (
    <Container>
      <AdminPageHeader title="홈 관리" backTo="/admin/dashboard" onBack={handleBack} />
      <Content>
        {profileLoading || artworksLoading ? (
          <p>데이터 로딩 중...</p>
        ) : (
          <>
            <Section>
              <SectionHeader>
                <SectionTitle>전시 정보</SectionTitle>
                <SaveButton type="button" onClick={handleEditExhibitionInfo}>수정</SaveButton>
              </SectionHeader>
              <ExhibitionText>
                전시 제목: {(homeExhibitionTitle ?? DEFAULT_HOME_SETTINGS.exhibitionTitle) || '미입력'}
              </ExhibitionText>
              <ExhibitionText>
                전시 날짜 표기: {(homeExhibitionDate ?? DEFAULT_HOME_SETTINGS.exhibitionDate) || '미입력'}
              </ExhibitionText>
              <ExhibitionText>
                갤러리·미술관 이름: {(homeGalleryName ?? DEFAULT_HOME_SETTINGS.galleryName) || '미입력'}
              </ExhibitionText>
            </Section>

            <Section>
              <SectionHeader>
                <SectionTitle>홈 화면 작품 ({selectedArtworkIds.length}개 선택)</SectionTitle>
                <SaveButton type="button" onClick={handleEditArtworks}>
                  편집
                </SaveButton>
              </SectionHeader>
              <ArtworkHelp>등록일 최신순으로 표시됩니다. 작품 수 제한은 없습니다.</ArtworkHelp>
              {artworks.length === 0 ? (
                <p>등록된 작품이 없습니다.</p>
              ) : homeArtworks.length === 0 ? (
                <p>홈 화면에 표시할 작품이 선택되지 않았습니다.</p>
              ) : (
                <ArtworkList>
                  {homeArtworks.map(artwork => (
                    <ArtworkItem key={String(artwork.id)}>
                      {artwork.image && <img src={artwork.image} alt="" />}
                      <span>{artwork.title || '제목 미입력'}{artwork.year ? ` (${artwork.year})` : ''}</span>
                    </ArtworkItem>
                  ))}
                </ArtworkList>
              )}
            </Section>
          </>
        )}
      </Content>
    </Container>
  );
};

export default HomeManagement;
