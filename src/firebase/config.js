// Firebase 설정 파일
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase 프로젝트 설정 (환경변수 사용)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 인스턴스
export const db = getFirestore(app);

// Firebase Auth 인스턴스
export const auth = getAuth(app);

// 개발 환경에서 Firestore 에뮬레이터 사용 (선택사항)
// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;