import React, { createContext, useContext, useState, useEffect } from 'react';

const ArtworkContext = createContext();

export const useArtworks = () => {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error('useArtworks must be used within an ArtworkProvider');
  }
  return context;
};

export const ArtworkProvider = ({ children }) => {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 작품 데이터 로드
    const savedArtworks = localStorage.getItem('artworks');
    if (savedArtworks) {
      setArtworks(JSON.parse(savedArtworks));
    } else {
      // 기본 데이터가 없으면 기존 artworks 데이터 사용
      import('../data/artworks').then((module) => {
        setArtworks(module.default);
        localStorage.setItem('artworks', JSON.stringify(module.default));
      });
    }
    setIsLoading(false);
  }, []);

  const saveArtworks = (newArtworks) => {
    setArtworks(newArtworks);
    localStorage.setItem('artworks', JSON.stringify(newArtworks));
  };

  const addArtwork = (artwork) => {
    const newArtwork = {
      ...artwork,
      id: Date.now(), // 실제로는 UUID 사용 권장
      createdAt: new Date().toISOString()
    };
    const newArtworks = [...artworks, newArtwork];
    saveArtworks(newArtworks);
  };

  const updateArtwork = (id, updatedArtwork) => {
    const newArtworks = artworks.map(artwork =>
      artwork.id === id ? { ...artwork, ...updatedArtwork } : artwork
    );
    saveArtworks(newArtworks);
  };

  const deleteArtwork = (id) => {
    const newArtworks = artworks.filter(artwork => artwork.id !== id);
    saveArtworks(newArtworks);
  };

  const reorderArtworks = (startIndex, endIndex) => {
    const result = Array.from(artworks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    saveArtworks(result);
  };

  const getArtworkById = (id) => {
    return artworks.find(artwork => artwork.id === parseInt(id));
  };

  return (
    <ArtworkContext.Provider value={{
      artworks,
      isLoading,
      addArtwork,
      updateArtwork,
      deleteArtwork,
      reorderArtworks,
      getArtworkById
    }}>
      {children}
    </ArtworkContext.Provider>
  );
};