import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useArtworks } from '../contexts/ArtworkContext';

const HomeContainer = styled.div`
  min-height: calc(100vh - 112px);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
  
  @media (max-width: 768px) {
    height: 100%;
    padding: 0;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 360px 360px 360px 360px;
  gap: 2rem;
  width: 100%;
  height: calc(100vh - 112px);
  align-items: center;
  justify-content: center;
  max-width: 1680px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    width: 100vw;
    height: calc(100vh - 150px);
    gap: 0.5rem;
    padding: 0.5rem;
    margin: 0;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const ImageContainer = styled.div`
  width: 360px;
  height: 480px;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
  
`;

const ImageComponent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 1s ease-in-out;
  opacity: ${props => props.isVisible ? 1 : 0};
  position: absolute;
  top: 0;
  left: 0;
`;

const WhiteOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 1s ease-in-out;
  z-index: 2;
`;

const SkeletonContainer = styled.div`
  width: 360px;
  height: 480px;
  background: #f0f0f0;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
`;

const PlaceholderContainer = styled.div`
  width: 360px;
  height: 480px;
  background: #e0e0e0;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
`;



const Home = () => {
  const { artworks } = useArtworks();
  const [currentImages, setCurrentImages] = useState([]);
  const [nextImages, setNextImages] = useState([]);
  const [showCurrent, setShowCurrent] = useState(true);
  const [isWhiteFlash, setIsWhiteFlash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const getRandomArtworks = () => {
    if (!artworks || artworks.length === 0) return [];
    
    // 작품이 4개 미만인 경우 처리
    if (artworks.length <= 4) {
      return [...artworks];
    }
    
    // 작품 배열을 섞어서 중복 없는 4개 선택
    const shuffled = [...artworks].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    // 중복 검사 (혹시 모를 상황에 대비)
    const uniqueIds = new Set(selected.map(artwork => artwork.id));
    if (uniqueIds.size !== 4 && artworks.length >= 4) {
      // 중복이 발생한 경우 재귀적으로 다시 선택
      return getRandomArtworks();
    }
    
    return selected;
  };

  useEffect(() => {
    // 100ms 후에 skeleton screen 표시
    const skeletonTimer = setTimeout(() => {
      if (isLoading) {
        setShowSkeleton(true);
      }
    }, 100);

    // artworks가 로드된 후 초기 이미지 설정
    if (artworks !== undefined) {
      setIsLoading(false);
      setShowSkeleton(false);
      
      if (artworks.length > 0) {
        const initialImages = getRandomArtworks();
        setCurrentImages(initialImages);
        setNextImages(getRandomArtworks());
      }
    }

    return () => clearTimeout(skeletonTimer);
  }, [artworks]);

  useEffect(() => {
    const interval = setInterval(() => {
      // 다음 이미지들을 미리 준비
      const newImages = getRandomArtworks();
      setNextImages(newImages);
      
      // 1단계: 흰색 오버레이 나타남 (1000ms)
      setIsWhiteFlash(true);
      
      setTimeout(() => {
        // 2단계: 이미지 교체 후 흰색 유지 (100ms)
        setCurrentImages(nextImages);
        setNextImages(newImages);
        setShowCurrent(false);
        
        setTimeout(() => {
          // 3단계: 흰색 오버레이 사라지고 새 이미지 나타남 (1000ms)
          setShowCurrent(true);
          setIsWhiteFlash(false);
        }, 100);
        
      }, 1000);
      
    }, 5000); // 5초마다 실행

    return () => clearInterval(interval);
  }, [nextImages]);

  // 로딩 상태: skeleton screen 표시
  if (showSkeleton || (artworks === undefined)) {
    return (
      <HomeContainer>
        <MainContent>
          <SkeletonContainer />
          <SkeletonContainer />
          <SkeletonContainer />
          <SkeletonContainer />
        </MainContent>
      </HomeContainer>
    );
  }

  // 작품이 없는 경우: 회색 placeholder 표시
  if (artworks && artworks.length === 0) {
    return (
      <HomeContainer>
        <MainContent>
          <PlaceholderContainer />
          <PlaceholderContainer />
          <PlaceholderContainer />
          <PlaceholderContainer />
        </MainContent>
      </HomeContainer>
    );
  }

  // 작품은 있지만 currentImages가 아직 설정되지 않은 경우
  if (currentImages.length === 0) {
    return (
      <HomeContainer>
        <MainContent>
          <SkeletonContainer />
          <SkeletonContainer />
          <SkeletonContainer />
          <SkeletonContainer />
        </MainContent>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <MainContent>
        <ImageContainer>
          <ImageComponent 
            src={currentImages[0]?.image} 
            alt={currentImages[0]?.title}
            isVisible={showCurrent}
          />
          <WhiteOverlay show={isWhiteFlash} />
        </ImageContainer>
        
        <ImageContainer>
          <ImageComponent 
            src={currentImages[1]?.image} 
            alt={currentImages[1]?.title}
            isVisible={showCurrent}
          />
          <WhiteOverlay show={isWhiteFlash} />
        </ImageContainer>
        
        <ImageContainer>
          <ImageComponent 
            src={currentImages[2]?.image} 
            alt={currentImages[2]?.title}
            isVisible={showCurrent}
          />
          <WhiteOverlay show={isWhiteFlash} />
        </ImageContainer>
        
        <ImageContainer>
          <ImageComponent 
            src={currentImages[3]?.image} 
            alt={currentImages[3]?.title}
            isVisible={showCurrent}
          />
          <WhiteOverlay show={isWhiteFlash} />
        </ImageContainer>
      </MainContent>
    </HomeContainer>
  );
};

export default Home;