import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  query,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    // Firestore 실시간 리스너 설정
    const artworksCollection = collection(db, 'artworks');
    const q = query(artworksCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const artworksData = [];
        querySnapshot.forEach((doc) => {
          artworksData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setArtworks(artworksData);
        setIsLoading(false);
        setError(null);
        
        // 로컬 백업 저장 (오프라인 시 사용)
        localStorage.setItem('artworks_backup', JSON.stringify(artworksData));
      },
      (err) => {
        console.error('Firestore 연결 오류:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        
        // 오류 시 로컬 백업 데이터 사용
        const backup = localStorage.getItem('artworks_backup');
        if (backup) {
          setArtworks(JSON.parse(backup));
        } else {
          // 백업도 없으면 기본 데이터 사용
          import('../data/artworks').then((module) => {
            setArtworks(module.default || []);
          }).catch(console.error);
        }
        setIsLoading(false);
      }
    );

    // 컴포넌트 언마운트 시 리스너 해제
    return () => unsubscribe();
  }, []);

  // 작품 추가
  const addArtwork = async (artwork) => {
    try {
      setError(null);
      const docRef = await addDoc(collection(db, 'artworks'), {
        ...artwork,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('작품이 추가되었습니다. ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('작품 추가 실패:', error);
      setError('작품 추가 중 오류가 발생했습니다.');
      return { success: false, error: error.message };
    }
  };

  // 작품 수정
  const updateArtwork = async (id, updatedArtwork) => {
    try {
      setError(null);
      const artworkRef = doc(db, 'artworks', id);
      await updateDoc(artworkRef, {
        ...updatedArtwork,
        updatedAt: new Date()
      });
      console.log('작품이 수정되었습니다. ID:', id);
      return { success: true };
    } catch (error) {
      console.error('작품 수정 실패:', error);
      setError('작품 수정 중 오류가 발생했습니다.');
      return { success: false, error: error.message };
    }
  };

  // 작품 삭제
  const deleteArtwork = async (id) => {
    try {
      setError(null);
      await deleteDoc(doc(db, 'artworks', id));
      console.log('작품이 삭제되었습니다. ID:', id);
      return { success: true };
    } catch (error) {
      console.error('작품 삭제 실패:', error);
      setError('작품 삭제 중 오류가 발생했습니다.');
      return { success: false, error: error.message };
    }
  };

  // 작품 순서 변경 (배치 작업 사용)
  const reorderArtworks = async (reorderedArtworks) => {
    try {
      setError(null);
      const batch = writeBatch(db);
      
      reorderedArtworks.forEach((artwork, index) => {
        const artworkRef = doc(db, 'artworks', artwork.id);
        batch.update(artworkRef, { 
          order: index,
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
      console.log('작품 순서가 변경되었습니다.');
      return { success: true };
    } catch (error) {
      console.error('작품 순서 변경 실패:', error);
      setError('작품 순서 변경 중 오류가 발생했습니다.');
      return { success: false, error: error.message };
    }
  };

  // ID로 작품 찾기
  const getArtworkById = (id) => {
    return artworks.find(artwork => artwork.id === id);
  };

  // 오류 초기화
  const clearError = () => {
    setError(null);
  };

  return (
    <ArtworkContext.Provider value={{
      artworks,
      isLoading,
      error,
      addArtwork,
      updateArtwork,
      deleteArtwork,
      reorderArtworks,
      getArtworkById,
      clearError
    }}>
      {children}
    </ArtworkContext.Provider>
  );
};