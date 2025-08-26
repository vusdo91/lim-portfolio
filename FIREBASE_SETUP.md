# Firebase Firestore 설정 가이드

Firebase Firestore를 사용하여 실시간 데이터베이스 연동을 설정하는 방법입니다.

## 1. Firebase 프로젝트 생성

### 1.1 Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. Google 계정으로 로그인
3. "프로젝트 추가" 클릭

### 1.2 프로젝트 설정
1. **프로젝트 이름**: `lim-portfolio` (또는 원하는 이름)
2. **Google Analytics**: 선택사항 (포트폴리오 사이트는 불필요)
3. **지역**: Asia-northeast3 (서울) 추천

## 2. Firestore 데이터베이스 설정

### 2.1 데이터베이스 생성
1. Firebase Console → "Firestore Database" → "데이터베이스 만들기"
2. **보안 규칙**: "테스트 모드로 시작" 선택 (개발용)
3. **위치**: asia-northeast3 (서울) 선택

### 2.2 보안 규칙 설정 (중요!)
Firebase Console → Firestore Database → "규칙" 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 작품 컬렉션 - 읽기는 모두 허용, 쓰기는 인증된 사용자만
    match /artworks/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 프로필 컬렉션 - 읽기는 모두 허용, 쓰기는 인증된 사용자만
    match /profile/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 3. 웹 앱 등록 및 설정

### 3.1 웹 앱 추가
1. Firebase Console → 프로젝트 개요 → 웹 앱 추가 (</> 아이콘)
2. **앱 닉네임**: `lim-portfolio-web`
3. Firebase Hosting 체크박스는 선택하지 않음

### 3.2 환경 변수 설정
프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 3.3 설정 파일 업데이트
`src/firebase/config.js` 파일을 다음과 같이 수정:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
```

## 4. 무료 플랜 최적화

### 4.1 무료 한도
- **읽기**: 50,000회/월
- **쓰기**: 20,000회/월  
- **삭제**: 20,000회/월
- **저장소**: 1GB

### 4.2 비용 절약 팁
1. **필요한 데이터만 가져오기**
   ```javascript
   // ❌ 전체 문서 가져오기
   const snapshot = await getDocs(collection(db, "artworks"));
   
   // ✅ 필요한 필드만 가져오기
   const q = query(collection(db, "artworks"), limit(10));
   ```

2. **로컬 캐싱 활용**
   - 프로젝트에 이미 구현됨 (`localStorage` 백업)

3. **실시간 리스너를 꼭 필요한 곳에만 사용**
   - 현재 ArtworkContext와 ProfileContext에만 적용

## 5. 배포 전 확인사항

### 5.1 보안 규칙 업데이트
프로덕션 환경에서는 더 엄격한 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artworks/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
                   request.auth.token.email == "your-admin-email@example.com";
    }
    
    match /profile/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
                   request.auth.token.email == "your-admin-email@example.com";
    }
  }
}
```

### 5.2 환경 변수 확인
- `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- 배포 플랫폼(Vercel, Netlify 등)에 환경 변수 설정

## 6. 실시간 기능 테스트

### 6.1 테스트 방법
1. 브라우저 2개 창에서 사이트 열기
2. 한 창에서 관리자 페이지로 작품 추가/수정
3. 다른 창에서 즉시 반영되는지 확인

### 6.2 예상되는 동작
- ✅ 작품 추가 시 홈/작품 페이지에 즉시 반영
- ✅ 프로필 수정 시 About 페이지에 즉시 반영
- ✅ 네트워크 오류 시 로컬 캐시 사용
- ✅ 페이지 새로고침 없이 실시간 업데이트

## 7. 문제 해결

### 7.1 일반적인 오류
- **Permission denied**: 보안 규칙 확인
- **App not initialized**: Firebase 설정 확인
- **Network error**: 인터넷 연결 및 Firestore 상태 확인

### 7.2 디버깅 방법
브라우저 개발자 도구 → Console에서 Firebase 로그 확인:
```javascript
// Firestore 디버그 모드 활성화 (개발 시에만)
import { enableNetwork, disableNetwork } from 'firebase/firestore';
```

## 8. 참고 자료

- [Firebase 무료 플랜 한도](https://firebase.google.com/pricing)
- [Firestore 보안 규칙](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Firestore 실시간 업데이트](https://firebase.google.com/docs/firestore/query-data/listen)