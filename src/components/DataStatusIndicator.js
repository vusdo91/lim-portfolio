import React from 'react';
import styled from 'styled-components';
import { useArtworks } from '../contexts/ArtworkContext';
import { useProfile } from '../contexts/ProfileContext';

const StatusContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  z-index: 1000;
  display: ${props => props.show ? 'block' : 'none'};
`;

const StatusItem = styled.div`
  margin: 0.25rem 0;
`;

const DataStatusIndicator = ({ showInDev = false }) => {
  const { artworks, isLoading: artworksLoading } = useArtworks();
  const { profile, isLoading: profileLoading } = useProfile();
  
  // 개발 환경에서만 표시하거나 showInDev prop에 따라 표시
  const shouldShow = showInDev || process.env.NODE_ENV === 'development';
  
  if (!shouldShow) return null;

  return (
    <StatusContainer show={shouldShow}>
      <StatusItem>
        작품: {artworksLoading ? '로딩 중...' : `${artworks?.length || 0}개`}
      </StatusItem>
      <StatusItem>
        전시: {profileLoading ? '로딩 중...' : `${profile?.exhibitions?.length || 0}개`}
      </StatusItem>
      <StatusItem>
        소개문: {profileLoading ? '로딩 중...' : (profile?.biography ? '있음' : '없음')}
      </StatusItem>
    </StatusContainer>
  );
};

export default DataStatusIndicator;