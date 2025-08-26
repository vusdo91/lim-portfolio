import React, { useState } from 'react';
import styled from 'styled-components';
import { useArtworks } from '../contexts/ArtworkContext';

const WorksContainer = styled.div`
  min-height: calc(100vh - 112px);
  background: #f8f8f8;
  padding: 0;
  
  @media (max-width: 768px) {
    min-height: calc(100vh - 130px);
  }
`;

const MainContent = styled.div`
  display: flex;
  background: white;
  min-height: calc(100vh - 112px);
  
  @media (max-width: 768px) {
    flex-direction: column;
    min-height: calc(100vh - 130px);
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem 3rem 3rem;
  max-width: calc(100vw - 500px);
  
  @media (max-width: 768px) {
    padding: 2rem;
    max-width: none;
  }
`;

const ImageContainer = styled.div`
  width: 640px;
  height: 640px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 320px;
    height: 320px;
  }
`;

const MainImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
`;

const Sidebar = styled.div`
  width: 500px;
  background: white;
  border-left: 1px solid #eee;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
  }
`;

const WorkInfo = styled.div`
  flex: 1;
  padding: 3rem 2rem;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 768px) {
    padding: 2rem;
    text-align: center;
  }
  
  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1E1E1E;
    margin: 0 0 1.5rem 0;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  .details {
    font-size: 0.8rem;
    color: #505050;
    line-height: 1;
    
    div {
      margin-bottom: 0.5rem;
    }
  }
`;

const NavigationArrows = styled.div`
  position: absolute;
  left: 3rem;
  right: calc(500px + 3rem);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  
  @media (max-width: 768px) {
    left: 2rem;
    right: 2rem;
  }
`;

const ArrowButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(50, 67, 13, 0.8);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: rgba(50, 67, 13, 1);
    transform: scale(1.1);
  }
  
  &:disabled {
    background: rgba(50, 67, 13, 0.3);
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  &::before {
    content: '${props => props.direction === 'left' ? '‹' : '›'}';
  }
`;

const ThumbnailSection = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    max-height: 300px;
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 24px);
  gap: 4px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, 20px);
    gap: 3px;
  }
`;

const ThumbnailContainer = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.7)'};
    pointer-events: none;
    transition: all 0.2s ease;
  }
  
  &:hover::after {
    background: transparent;
  }
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const Works = () => {
  const { artworks } = useArtworks();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // 모든 작품을 표시
  const currentArtwork = artworks[activeIndex];
  
  // 작품이 없는 경우 처리
  if (!artworks || artworks.length === 0) {
    return (
      <WorksContainer>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh',
          color: '#666',
          fontSize: '1.2rem'
        }}>
          작품이 없습니다.
        </div>
      </WorksContainer>
    );
  }
  
  return (
    <WorksContainer>
      <MainContent>
        <ImageSection>
          <NavigationArrows>
            <ArrowButton 
              direction="left" 
              onClick={() => setActiveIndex(activeIndex === 0 ? artworks.length - 1 : activeIndex - 1)} 
            />
            <ArrowButton 
              direction="right" 
              onClick={() => setActiveIndex(activeIndex === artworks.length - 1 ? 0 : activeIndex + 1)} 
            />
          </NavigationArrows>
          
          <ImageContainer>
            <MainImage src={currentArtwork?.image} alt={currentArtwork?.title} />
          </ImageContainer>
        </ImageSection>
        
        <Sidebar>
          <WorkInfo>
            <h1>{currentArtwork?.title}</h1>
            <div className="details">
              <div>{currentArtwork?.size}</div>
              <div>{currentArtwork?.material}</div>
              <div>{currentArtwork?.year}</div>
            </div>
          </WorkInfo>
          
          <ThumbnailSection>
            <ThumbnailGrid>
              {artworks.map((artwork, index) => (
                <ThumbnailContainer 
                  key={artwork.id}
                  active={activeIndex === index} 
                  onClick={() => setActiveIndex(index)} 
                >
                  <ThumbnailImage src={artwork.image} alt={artwork.title} />
                </ThumbnailContainer>
              ))}
            </ThumbnailGrid>
          </ThumbnailSection>
        </Sidebar>
      </MainContent>
    </WorksContainer>
  );
};

export default Works;