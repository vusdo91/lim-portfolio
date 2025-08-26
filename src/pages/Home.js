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
    min-height: calc(100vh - 130px);
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 360px 360px 360px 360px;
  gap: 2rem;
  width: 100%;
  height: calc(100vh - 112px);
  
  @media (max-width: 768px) {
    height: auto;
  }
  align-items: center;
  justify-content: center;
  max-width: 1680px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    height: auto;
    min-height: calc(100vh - 130px);
    gap: 1.5rem;
    padding: 2rem 1rem;
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
    height: 240px;
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

const TextContainer = styled.div`
  width: 360px;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 240px;
  }
`;

const TitleSection = styled.div`
  text-align: left;
  
  h1 {
    font-size: 4rem;
    margin: 0;
    line-height: 1;
    color: #000;
    
    .name {
      line-height: 1;
      color: #32430D;
    }
    
    @media (max-width: 768px) {
      font-size: 2.8rem;
    }
  }
`;

const Home = () => {
  const { artworks } = useArtworks();
  const [currentImages, setCurrentImages] = useState([]);
  const [nextImages, setNextImages] = useState([]);
  const [showCurrent, setShowCurrent] = useState(true);
  const [isWhiteFlash, setIsWhiteFlash] = useState(false);

  const getRandomArtworks = () => {
    if (!artworks || artworks.length === 0) return [];
    
    // 작품이 3개 미만인 경우 처리
    if (artworks.length <= 3) {
      return [...artworks];
    }
    
    // 작품 배열을 섞어서 중복 없는 3개 선택
    const shuffled = [...artworks].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    // 중복 검사 (혹시 모를 상황에 대비)
    const uniqueIds = new Set(selected.map(artwork => artwork.id));
    if (uniqueIds.size !== 3 && artworks.length >= 3) {
      // 중복이 발생한 경우 재귀적으로 다시 선택
      return getRandomArtworks();
    }
    
    return selected;
  };

  useEffect(() => {
    // artworks가 로드된 후 초기 이미지 설정
    if (artworks && artworks.length > 0) {
      const initialImages = getRandomArtworks();
      setCurrentImages(initialImages);
      setNextImages(getRandomArtworks());
    }
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

  if (!artworks || artworks.length === 0 || currentImages.length === 0) {
    return (
      <HomeContainer>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh',
          color: '#666',
          fontSize: '1.2rem'
        }}>
          {artworks && artworks.length === 0 ? '작품이 없습니다.' : 'Loading...'}
        </div>
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
        
        <TextContainer>
          <TitleSection>
            <h1 className="coolvetica">
              Lim<br />
              yun<br />
              <span className="name">mook's</span><br />
              Studio
            </h1>
          </TitleSection>
        </TextContainer>
        
        <ImageContainer>
          <ImageComponent 
            src={currentImages[2]?.image} 
            alt={currentImages[2]?.title}
            isVisible={showCurrent}
          />
          <WhiteOverlay show={isWhiteFlash} />
        </ImageContainer>
      </MainContent>
    </HomeContainer>
  );
};

export default Home;