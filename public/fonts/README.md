# Fonts Directory

이 디렉토리에는 웹사이트에서 사용되는 커스텀 폰트 파일들이 저장됩니다.

## 필요한 폰트 파일들

### Coolvetica Font
- coolvetica.woff2
- coolvetica.woff  
- coolvetica.ttf
- coolvetica-bold.woff2
- coolvetica-bold.woff
- coolvetica-bold.ttf

### NanumSquare Font
- NanumSquare-Light.woff2
- NanumSquare-Light.woff
- NanumSquare-Light.ttf
- NanumSquare-Regular.woff2
- NanumSquare-Regular.woff
- NanumSquare-Regular.ttf
- NanumSquare-Bold.woff2
- NanumSquare-Bold.woff
- NanumSquare-Bold.ttf
- NanumSquare-ExtraBold.woff2
- NanumSquare-ExtraBold.woff
- NanumSquare-ExtraBold.ttf

## 사용 방법

CSS에서 다음과 같이 사용할 수 있습니다:

```css
/* Coolvetica 폰트 사용 */
.title {
  font-family: 'Coolvetica', sans-serif;
}

/* NanumSquare 폰트 사용 */
.content {
  font-family: 'NanumSquare', sans-serif;
  font-weight: 400; /* Light: 300, Regular: 400, Bold: 700, ExtraBold: 800 */
}
```

또는 미리 정의된 클래스를 사용:

```html
<div class="coolvetica">Coolvetica 폰트</div>
<div class="nanum-regular">나눔스퀘어 레귤러</div>
<div class="nanum-bold">나눔스퀘어 볼드</div>
```