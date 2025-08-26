import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

export const uploadImage = async (imageFile, folder = 'artworks') => {
  try {
    if (!imageFile) {
      throw new Error('이미지 파일이 없습니다.');
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const fileName = `${timestamp}_${imageFile.name}`;
    const imageRef = ref(storage, `${folder}/${fileName}`);

    // 이미지 업로드
    const snapshot = await uploadBytes(imageRef, imageFile);
    
    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) {
      throw new Error('이미지 경로가 없습니다.');
    }

    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('이미지 삭제 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 이미지 URL에서 경로 추출 (Firebase Storage URL에서)
export const extractImagePath = (imageUrl) => {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') return null;
    
    // Firebase Storage URL 형식인지 확인
    if (imageUrl.includes('firebasestorage.googleapis.com')) {
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.*?)\?/);
      return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
    }
    
    return null;
  } catch (error) {
    console.error('이미지 경로 추출 실패:', error);
    return null;
  }
};