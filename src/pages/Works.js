import React, { useState, useEffect } from 'react';
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
    border-top: none;
  }
`;

const WorkInfo = styled.div`
  flex: 1;
  padding: 3rem 2rem;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 768px) {
    padding: 2rem;
    text-align: center;
    border-bottom: none;
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
    left: 0.5rem;
    right: 0.5rem;
    top: calc(50% - 160px);
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
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
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
    grid-template-columns: repeat(auto-fit, 28px);
    gap: 5px;
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
    width: 28px;
    height: 28px;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  transform: scale(${props => props.zoom}) translate(${props => props.x / props.zoom}px, ${props => props.y / props.zoom}px);
  transition: ${props => props.isDragging ? 'none' : 'transform 0.2s ease'};
  cursor: ${props => props.zoom > 1 ? (props.isDragging ? 'grabbing' : 'grab') : 'zoom-in'};
  user-select: none;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2001;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    top: 1rem;
    right: 1rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  &::before {
    content: '×';
  }
`;

const ModalNavigation = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 2001;
  align-items: center;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    gap: 0.8rem;
  }
`;

const ModalArrowButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  &::before {
    content: '${props => props.direction === 'left' ? '‹' : '›'}';
  }
`;

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ZoomButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Works = () => {
  const { artworks } = useArtworks();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Modal event handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 1));
    if (zoomLevel <= 1) {
      setDragPosition({ x: 0, y: 0 });
    }
  };
  
  const handleImageClick = (e) => {
    if (zoomLevel === 1) {
      handleZoomIn();
    } else {
      const rect = e.target.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      const offsetX = (centerX - clickX) * 0.5;
      const offsetY = (centerY - clickY) * 0.5;
      
      setDragPosition(prev => ({
        x: prev.x + offsetX,
        y: prev.y + offsetY
      }));
    }
  };
  
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - dragPosition.x,
        y: e.clientY - dragPosition.y
      });
    }
  };
  
  const handleTouchStart = (e) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      e.preventDefault();
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - dragPosition.x,
        y: touch.clientY - dragPosition.y
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      e.preventDefault();
      setDragPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleTouchMove = (e) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setDragPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
  };
  
  const navigateModal = (direction) => {
    const newIndex = direction === 'next' 
      ? (modalImageIndex + 1) % artworks.length
      : modalImageIndex === 0 ? artworks.length - 1 : modalImageIndex - 1;
    setModalImageIndex(newIndex);
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
  };
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          navigateModal('prev');
          break;
        case 'ArrowRight':
          navigateModal('next');
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, modalImageIndex, zoomLevel]);
  
  // Mouse and touch events
  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStart, isModalOpen]);
  
  // 모든 작품을 표시
  const currentArtwork = artworks[activeIndex];
  const modalArtwork = artworks[modalImageIndex];
  
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
            <MainImage 
              src={currentArtwork?.image} 
              alt={currentArtwork?.title}
              onClick={() => {
                setModalImageIndex(activeIndex);
                setIsModalOpen(true);
                setZoomLevel(1);
                setDragPosition({ x: 0, y: 0 });
              }}
              style={{ cursor: 'pointer' }}
            />
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
      
      {/* Modal */}
      <ModalOverlay show={isModalOpen} onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <ModalContent>
          <CloseButton onClick={closeModal} />
          
          <ModalImage
            src={modalArtwork?.image}
            alt={modalArtwork?.title}
            zoom={zoomLevel}
            x={dragPosition.x}
            y={dragPosition.y}
            isDragging={isDragging}
            onClick={handleImageClick}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            draggable={false}
          />
          
          <ModalNavigation>
            <ControlButton 
              onClick={() => navigateModal('prev')}
              disabled={artworks.length <= 1}
            >
              ‹
            </ControlButton>
            
            <ControlButton onClick={handleZoomOut} disabled={zoomLevel <= 1}>
              -
            </ControlButton>
            
            <ControlButton onClick={handleZoomIn} disabled={zoomLevel >= 3}>
              +
            </ControlButton>
            
            <ControlButton 
              onClick={() => navigateModal('next')}
              disabled={artworks.length <= 1}
            >
              ›
            </ControlButton>
          </ModalNavigation>
        </ModalContent>
      </ModalOverlay>
    </WorksContainer>
  );
};

export default Works;