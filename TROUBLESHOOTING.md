# Firebase 연동 문제 해결 가이드

## 🔍 일반적인 오류들

### 1. "Firebase: No Firebase App '[DEFAULT]' has been created"
**원인**: Firebase 설정이 올바르지 않음
**해결**:
```javascript
// .env.local 파일 확인
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_PROJECT_ID=your-actual-project-id
// ... 다른 환경 변수들
```

### 2. "Missing or insufficient permissions"
**원인**: Firestore 보안 규칙 문제
**해결**: Firebase Console → Firestore → 규칙에서 임시로 설정
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // 임시 개방
    }
  }
}
```

### 3. 관리자 로그인이 안됨
**원인**: 인증 시스템 문제
**해결**: 현재는 간단한 로그인이므로 기본 계정 사용
- ID: admin / PW: password (예상)

### 4. 이미지가 로딩되지 않음
**원인**: 이미지 URL 문제
**해결**: Base64 또는 외부 이미지 URL 사용

## 🧪 테스트 데이터 추가

Firebase Console에서 수동으로 테스트 데이터 추가:

### artworks 컬렉션 생성
```json
// 문서 ID: auto-generated
{
  "title": "테스트 작품",
  "size": "50x70cm", 
  "material": "캔버스에 유채",
  "year": "2024",
  "description": "테스트용 작품입니다",
  "image": "https://picsum.photos/400/600",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### profile 컬렉션 생성
```json
// 문서 ID: "main"
{
  "biography": "테스트 작가 소개문",
  "biography_en": "Test artist biography",
  "exhibitions": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 📊 디버깅 방법

### 브라우저 개발자 도구
```javascript
// Console에서 Firebase 연결 확인
console.log('Firebase config:', app.options);

// Firestore 데이터 직접 조회
import { collection, getDocs } from 'firebase/firestore';
const querySnapshot = await getDocs(collection(db, "artworks"));
querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
});
```

### 네트워크 탭 확인
- Firebase API 요청이 성공하는지 확인
- 상태 코드 200인지 확인
- 응답 데이터가 올바른지 확인