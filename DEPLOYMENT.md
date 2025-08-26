# Vercel 배포 가이드

Firebase Firestore가 추가된 후 Vercel 배포 시 필요한 설정들입니다.

## 🚀 배포 전 준비사항

### 1. Firebase 프로젝트 설정 완료
- [ ] Firebase Console에서 프로젝트 생성
- [ ] Firestore 데이터베이스 활성화
- [ ] 보안 규칙 설정
- [ ] 웹 앱 등록 및 구성 정보 확보

### 2. 로컬 테스트 완료
- [ ] `.env.local` 파일 설정
- [ ] `npm start`로 로컬 실행 확인
- [ ] Firebase 연결 및 실시간 업데이트 테스트
- [ ] 관리자 페이지 작품 추가/수정/삭제 테스트

## 🔧 Vercel 설정

### 1. 환경 변수 설정 (필수)

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에서 설정:

```bash
# Production 환경에 다음 변수들 추가
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

**⚠️ 중요**: Environment를 **"Production"**으로 설정해야 합니다.

### 2. 빌드 설정 확인

Vercel이 자동으로 감지하지만, 수동 설정 시:
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3. 도메인 설정 (선택사항)

Firebase 보안 규칙에서 특정 도메인만 허용하려면:
```javascript
// Firebase Console → Authentication → Authorized domains
// Vercel 도메인 추가: your-project.vercel.app
```

## 🔐 보안 설정

### 1. Firebase 보안 규칙 업데이트

**개발용 (느슨한 규칙)**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artworks/{document} {
      allow read: if true;
      allow write: if true; // 개발용만
    }
    match /profile/{document} {
      allow read: if true;
      allow write: if true; // 개발용만
    }
  }
}
```

**프로덕션용 (권장)**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artworks/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /profile/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. API 키 제한 설정

Google Cloud Console에서 API 키 제한:
1. Google Cloud Console → API 및 서비스 → 사용자 인증 정보
2. Firebase API 키 선택
3. "애플리케이션 제한사항" → "HTTP 리퍼러" 선택
4. 도메인 추가:
   ```
   your-project.vercel.app/*
   *.your-project.vercel.app/*
   ```

## 📊 배포 후 확인사항

### 1. 기능 테스트
- [ ] 홈페이지 이미지 로딩 확인
- [ ] About 페이지 프로필 정보 표시 확인  
- [ ] Works 페이지 작품 목록 확인
- [ ] 관리자 로그인 페이지 접근 확인

### 2. 실시간 업데이트 테스트
- [ ] 관리자 페이지에서 작품 추가
- [ ] 다른 브라우저에서 즉시 반영 확인
- [ ] 프로필 정보 수정 후 실시간 반영 확인

### 3. 성능 확인
- [ ] 페이지 로딩 속도 확인
- [ ] Firebase 연결 지연시간 확인
- [ ] 모바일 디바이스 테스트

## 🐛 문제 해결

### 1. 일반적인 오류들

**환경 변수 오류**:
```bash
# 오류: Firebase config is missing
# 해결: Vercel 환경 변수 설정 확인
```

**CORS 오류**:
```bash
# 오류: Access-Control-Allow-Origin
# 해결: Firebase Console → Authentication → Authorized domains에 도메인 추가
```

**보안 규칙 오류**:
```bash
# 오류: Missing or insufficient permissions
# 해결: Firebase Console → Firestore → Rules 확인
```

### 2. 디버깅 방법

**Vercel 함수 로그 확인**:
```bash
vercel logs your-project-url
```

**브라우저 개발자 도구**:
- Network 탭에서 Firebase 요청 확인
- Console에서 JavaScript 오류 확인

## 📈 모니터링

### 1. Firebase 사용량 모니터링
Firebase Console → 사용량에서 확인:
- 읽기/쓰기 횟수
- 저장소 사용량
- 네트워크 사용량

### 2. Vercel Analytics (선택사항)
Vercel 대시보드에서 페이지 로딩 성능 모니터링

## 🔄 업데이트 배포

코드 변경 후 배포:
1. Git에 변경사항 커밋 및 푸시
2. Vercel이 자동으로 감지하여 배포 시작
3. 배포 완료 후 기능 테스트

---

**💡 팁**: 첫 배포 시에는 개발용 보안 규칙으로 시작하여 정상 작동 확인 후, 프로덕션용 규칙으로 변경하는 것을 권장합니다.