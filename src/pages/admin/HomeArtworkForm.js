import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useArtworks } from '../../contexts/ArtworkContext';
import { useProfile } from '../../contexts/ProfileContext';
import AdminPageHeader from './AdminPageHeader';
import YearFilter, { getYearOptions } from '../../components/YearFilter';
import { getHomeArtworkIds } from '../../utils/homeSettings';
import useUnsavedChanges from '../../hooks/useUnsavedChanges';

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
`;

const Panel = styled.section`
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Help = styled.p`
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const ArtworkList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;
`;

const ArtworkOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

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

  input {
    flex: 0 0 auto;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.55rem 0.9rem;
  border: 0;
  border-radius: 4px;
  background: ${props => props.$primary ? '#2d2d2d' : '#6c757d'};
  color: white;
  font: inherit;
  cursor: pointer;

  &:disabled {
    background: #888;
    cursor: wait;
  }
`;

const Status = styled.p`
  margin-top: 1rem;
  color: #b42318;
`;

const HomeArtworkForm = () => {
  const navigate = useNavigate();
  const { artworks, isLoading: artworksLoading } = useArtworks();
  const { profile, isLoading: profileLoading, updateHomeSettings } = useProfile();
  const [selectedArtworkIds, setSelectedArtworkIds] = useState([]);
  const [initialArtworkIds, setInitialArtworkIds] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const isDirty = JSON.stringify(selectedArtworkIds) !== JSON.stringify(initialArtworkIds);
  const { confirmNavigation, markSaved } = useUnsavedChanges(isDirty);
  const yearOptions = useMemo(() => getYearOptions(artworks), [artworks]);
  const visibleArtworks = selectedYear === 'all'
    ? artworks
    : artworks.filter(artwork => String(artwork.year || '').trim() === selectedYear);

  useEffect(() => {
    if (profileLoading || artworksLoading) return;
    const artworkIds = getHomeArtworkIds(profile, artworks);
    setSelectedArtworkIds(artworkIds);
    setInitialArtworkIds(artworkIds);
  }, [profile, profileLoading, artworks, artworksLoading]);

  useEffect(() => {
    if (!yearOptions.includes(selectedYear)) setSelectedYear('all');
  }, [selectedYear, yearOptions]);

  const handleBack = () => {
    if (confirmNavigation()) navigate('/admin/home');
  };

  const handleToggleArtwork = id => {
    const normalizedId = String(id);
    setSelectedArtworkIds(current => current.includes(normalizedId)
      ? current.filter(selectedId => selectedId !== normalizedId)
      : [...current, normalizedId]);
    setError('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const result = await updateHomeSettings({ artworkIds: selectedArtworkIds });
      if (!result.success) {
        setError(`저장에 실패했습니다: ${result.error}`);
        return;
      }
      markSaved();
      navigate('/admin/home');
    } catch (saveError) {
      console.error('홈 작품 목록 저장 중 오류:', saveError);
      setError('홈 작품 목록 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <AdminPageHeader title="홈 화면 작품 편집" backTo="/admin/home" onBack={handleBack} />
      <Content>
        {profileLoading || artworksLoading ? (
          <p>데이터 로딩 중...</p>
        ) : (
          <Panel>
            <Help>홈 화면에 표시할 작품을 선택하세요. 등록일 최신순으로 표시되며 작품 수 제한은 없습니다.</Help>
            <YearFilter
              years={yearOptions}
              selectedYear={selectedYear}
              onSelect={setSelectedYear}
              label="홈 작품 연도 필터"
            />
            {artworks.length === 0 ? (
              <p>등록된 작품이 없습니다.</p>
            ) : visibleArtworks.length === 0 ? (
              <p>해당 연도에 등록된 작품이 없습니다.</p>
            ) : (
              <ArtworkList>
                {visibleArtworks.map(artwork => {
                  const id = String(artwork.id);
                  return (
                    <ArtworkOption key={id}>
                      <input
                        type="checkbox"
                        aria-label={artwork.title || '제목 미입력'}
                        checked={selectedArtworkIds.includes(id)}
                        onChange={() => handleToggleArtwork(id)}
                      />
                      {artwork.image && <img src={artwork.image} alt="" />}
                      <span>{artwork.title || '제목 미입력'}{artwork.year ? ` (${artwork.year})` : ''}</span>
                    </ArtworkOption>
                  );
                })}
              </ArtworkList>
            )}
            {error && <Status role="alert">{error}</Status>}
            <Actions>
              <Button type="button" $primary onClick={handleSave} disabled={isSaving}>
                {isSaving ? '저장 중...' : '저장하기'}
              </Button>
              <Button type="button" onClick={handleBack}>취소</Button>
            </Actions>
          </Panel>
        )}
      </Content>
    </Container>
  );
};

export default HomeArtworkForm;
