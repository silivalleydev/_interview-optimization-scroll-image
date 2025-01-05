# 렌더링 최적화(무한스크롤, 스크롤 시 element 렌더링, 이미지 최적화 등)

### InfiniteList 컴포넌트
#### 최적화 내용
1. useCallback으로 함수 참조 고정:
- loadMore와 handleScroll을 useCallback으로 감싸서 참조 동일성을 유지.
- 불필요한 리렌더링 및 이벤트 리스너 재등록 방지.

2. 스크롤 이벤트 최적화:
- handleScroll에서 스크롤 위치를 확인하고, 조건에 맞을 때만 loadMore 실행.
- 불필요한 API 호출 방지.

3. Suspense와 Lazy 로딩 사용:
- ListItem 컴포넌트를 동적으로 로드하며, 초기 로딩 중에는 fallback 콘텐츠를 표시.
- 초기 번들 크기 감소와 로딩 속도 개선.

4. 로딩 상태 관리:
- loading 상태를 사용해 중복 데이터 로드를 방지.
- 사용자가 데이터를 기다리고 있음을 시각적으로 전달.

### ListItem 컴포넌트

#### 최적화 내용

1. IntersectionObserver를 통한 조건부 렌더링:
- IntersectionObserver를 사용해 리스트 항목이 화면에 보일 때만 isVisible 상태를 true로 업데이트.
- 가시성 상태에 따라 콘텐츠를 동적으로 렌더링하여 불필요한 작업 방지.

2. 조건부 렌더링으로 성능 개선:
- isVisible이 true일 때만 LazyImage와 텍스트 콘텐츠를 렌더링.
- 화면 밖에 있는 항목은 렌더링하지 않음으로써 성능 최적화.

3. 스타일 및 배경 전환 효과:
- isVisible 상태에 따라 배경색 변경과 전환 애니메이션 추가.
- UI 개선과 함께 현재 활성화된 항목을 시각적으로 강조.

### LazyImage 컴포넌트

#### 최적화 내용

1. IntersectionObserver 활용
- IntersectionObserver를 사용해 이미지를 화면에 보일 때만 로드.
- entry.isIntersecting 상태를 감지하여, 뷰포트에 들어오면 isVisible 상태를 업데이트.
- 화면에 보이지 않는 이미지를 로드하지 않음으로써 네트워크 트래픽을 줄이고 초기 로딩 성능을 개선.
- 한 번 관찰 후 observer.disconnect()로 관찰을 중단하여 불필요한 연산 방지.

2. 가시성에 따른 조건부 렌더링
- isVisible 상태에 따라 src 속성을 동적으로 설정:
```js
src={isVisible ? src : undefined}
```
- 이미지가 뷰포트에 들어오지 않은 상태에서는 네트워크 요청이 발생하지 않도록 제어.
- 초기 렌더링 시 모든 이미지를 로드하지 않으므로, 렌더링 비용 감소.

3. useRef로 DOM 접근 최적화
- imgRef를 사용해 DOM 요소를 직접 참조하고, 이를 IntersectionObserver와 연동.
- React의 상태 업데이트와 별개로 DOM 요소를 직접 제어하여 성능 부담 최소화.
- 중복 관찰이나 불필요한 DOM 접근을 방지.

4. 컴포넌트 언마운트 처리
- useEffect의 반환값으로 observer.disconnect()를 호출:
```js
return () => observer.disconnect();
```
- 컴포넌트가 언마운트되거나 재렌더링될 때 메모리 누수를 방지.
- 불필요한 관찰을 중단하여 리소스 사용 최소화.

### IntersectionObserver란?
- IntersectionObserver는 DOM 요소가 뷰포트(Viewport) 또는 다른 지정된 조상 요소와 교차(Intersect)하는 지점을 비동기로 관찰하는 API입니다.
- 이 API는 특히 지연 로드(Lazy Loading), 무한 스크롤(Infinite Scroll), 애니메이션 트리거, 광고 노출 추적 등에서 자주 사용됩니다.

#### IntersectionObserver의 주요 특징
1. 비동기적 관찰:
- 메인 스레드와 독립적으로 동작하므로, 성능에 영향을 최소화.

2. 관찰 대상(Element):
- DOM 요소가 화면의 특정 영역(뷰포트)과 교차하는지를 관찰 가능.

3. 옵션 제공:
- root: 관찰 기준이 되는 요소(기본값: 브라우저 뷰포트).
- rootMargin: 관찰 기준 상하좌우 여백(예: 10px, 50%).
- threshold: 교차 비율(0~1) 또는 배열로 설정 가능.
```js
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(`${entry.target.id} is visible!`);
        observer.unobserve(entry.target); // 한 번만 관찰
      }
    });
  },
  {
    root: null, // 브라우저 뷰포트를 기준
    rootMargin: '0px', // 여백 없음
    threshold: 0.1, // 요소의 10% 이상이 보일 때
  }
);

// 관찰 대상 등록
const targetElement = document.querySelector('#target');
observer.observe(targetElement);
```

#### 옵션 설명
1. root:
- 관찰 기준 요소입니다.
- null로 설정 시 브라우저의 뷰포트가 기준이 됩니다.

2. rootMargin:
- 관찰 기준 요소의 여백을 설정합니다.
- 예: '10px 20px 10px 20px' (상, 우, 하, 좌 순서).

3. threshold:
- 요소가 기준 영역과 교차하는 비율.
- 0은 "픽셀 단위로 교차 시작"을 의미, 1.0은 "완전히 보일 때"를 의미.

### IntersectionObserver의 장점

1. 성능 최적화:
- 스크롤 이벤트와 달리, IntersectionObserver는 이벤트 루프에서 직접 실행되지 않고 비동기로 처리되므로 메인 스레드 부하를 줄입니다.

2. 단순화된 코드:
- 스크롤 위치 계산 로직 없이도 특정 요소의 가시성을 확인 가능.

3. 사용 사례의 다양성:
- 이미지 Lazy Loading, 무한 스크롤, 애니메이션 트리거 등 다양한 시나리오에 적합.

#### IntersectionObserver의 크로스브라우징 지원(폴리필 관련)

1. 브라우저 지원
- IntersectionObserver는 대부분의 최신 브라우저에서 지원됩니다.

2. 브라우저(최소 지원 버전)
- Chrome	51
- Edge	15
- Firefox	55
- Safari	12.1
- Opera	38
- IE	지원하지 않음

#### 크로스브라우징 이슈
**Internet Explorer(IE)**에서는 지원되지 않습니다.
하지만, IntersectionObserver Polyfill을 사용하여 호환성을 추가할 수 있습니다.

- Polyfill 사용 방법
```
npm install intersection-observer
```
```js
import 'intersection-observer'; // Polyfill 추가
```

2. Polyfill 추가 위치
Polyfill은 애플리케이션 전체에서 IntersectionObserver가 필요할 수 있으므로, 일반적으로 **프로젝트의 진입 파일(entry file)**에 추가합니다.

2. 1. CRA(Create React App) 사용 시
- src/index.js 파일에 추가:

```js
import 'intersection-observer'; // Polyfill 추가
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```
2. 2. Next.js 사용 시
- _app.js 파일에 추가:

```js
import 'intersection-observer'; // Polyfill 추가
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

2. 3. Webpack 설정 프로젝트
- Webpack의 진입 파일(예: src/index.js)에 추가:
```js
import 'intersection-observer'; // Polyfill 추가
```

3. Polyfill 적용 확인
Polyfill 추가 후, IntersectionObserver를 사용하는 코드가 IE에서도 정상적으로 동작하는지 확인합니다.

4. 주의사항
- Modern Browsers에서의 성능 최적화:
    - 최신 브라우저에서는 기본적으로 IntersectionObserver를 지원하므로, Polyfill은 필요하지 않습니다.
    - 불필요한 Polyfill 로딩을 방지하려면, Polyfill을 조건부로 로드할 수 있습니다:
```js
if (!('IntersectionObserver' in window)) {
  import('intersection-observer');
}
```
- IE 11에서 추가적인 Polyfill 필요:
- IE 11에서 IntersectionObserver 외에도 Promise, fetch, classList 등의 Polyfill이 필요할 수 있습니다.
- 이에 대한 종합적인 Polyfill 패키지로 **core-js**를 사용할 수 있습니다.

#### 결론
- intersection-observer Polyfill은 프로젝트의 **진입 파일(entry point)**에 추가하는 것이 가장 적합합니다. 이를 통해 애플리케이션 전반에서 IntersectionObserver를 IE에서도 사용할 수 있습니다.

### Lighthouse 사용법
#### Lighthouse란?
- Lighthouse는 Google Chrome에 내장된 웹 성능, 접근성, SEO 등을 측정하는 도구입니다. 초기 로딩 성능, Largest Contentful Paint(LCP), Cumulative Layout Shift(CLS) 등의 주요 지표를 확인하고 개선할 수 있습니다.

#### 사용 방법
1. Chrome DevTools 열기
- 브라우저에서 F12 키 또는 우클릭 → 검사 선택.

2. Lighthouse 탭 이동
- DevTools의 상단 메뉴에서 Lighthouse 탭 선택.

3. 검사 항목 선택
- 분석하려는 카테고리 선택:
    - Performance: 성능.
    - Accessibility: 접근성.
    - Best Practices: 베스트 프랙티스.
    - SEO: 검색 엔진 최적화.
    - PWA: 프로그레시브 웹 앱.

4. Analyze 버튼 클릭
- "Analyze page load" 버튼을 눌러 분석 시작.
- 완료 후 성능 점수와 개선 권장 사항을 확인.

### React DevTools Profiler 사용법

#### Profiler란?
- React DevTools Profiler는 React 애플리케이션의 렌더링 성능을 분석할 수 있는 도구입니다. 각 컴포넌트가 렌더링된 시간, 불필요한 리렌더링 여부 등을 확인할 수 있습니다.

#### 설치 방법

1. 브라우저 확장 프로그램 설치
- **React Developer Tools**를 설치합니다.

2.  DevTools에서 Profiler 사용
- DevTools를 열고 "⚛️ React" 탭 선택.
- Profiler 탭으로 이동.

#### 사용 방법

1. 프로파일링 시작
- ⚛️ React 탭 → Profiler 탭 이동.
- Start profiling 버튼 클릭.

2. 애플리케이션 상호작용
- 애플리케이션을 사용하는 동안 데이터를 수집합니다.

3. 프로파일링 중단 및 데이터 분석
- Stop profiling 클릭 후 컴포넌트 렌더링 데이터를 확인.
- 각 컴포넌트의 렌더링 시간, 호출 횟수, 불필요한 렌더링 여부를 확인.

4. "Why did this render?" 기능 활용
- 컴포넌트를 선택하고 "Why did this render?" 기능을 사용해 렌더링 원인을 분석.

### Lighthouse와 Profiler로 위의 사례 트래킹

#### 사례 1: Lighthouse로 초기 로딩 성능 분석

1. 트래킹 방법
- Lighthouse를 실행하고 Performance를 선택.

2. 주요 지표 확인:
- LCP (Largest Contentful Paint): 가장 큰 콘텐츠 렌더링 시간.
- CLS (Cumulative Layout Shift): 레이아웃 이동 점수.

3. 문제 전/후 비교:
- 최적화 전후의 LCP와 CLS 값을 비교하여 개선 정도 확인.

4. 최적화 작업:
- 코드 스플리팅, WebP 이미지 포맷 변환, CSS/JS 최소화.

#### 사례 2: React DevTools Profiler로 불필요한 렌더링 최적화

1. 트래킹 방법
- Profiler에서 Start profiling 후 애플리케이션 상호작용.

2. 렌더링 시간 확인:
- ListItem 컴포넌트가 데이터 업데이트 시 모두 재렌더링되는지 확인.

3. "Why did this render?" 분석:
- Props 참조 변경이 원인인지 파악.

4. 최적화 작업:
- React.memo 적용, useMemo로 정렬 로직 최적화.

5. 최적화 후 다시 Profiler로 분석:
- 렌더링 시간과 호출 횟수가 줄어드는지 확인.

#### 사례 3: Webpack Bundle Analyzer로 번들 크기 최적화

-  트래킹 방법
1. Webpack Bundle Analyzer 설치:
```
npm install --save-dev webpack-bundle-analyzer
```

2. Webpack 설정에 Analyzer 플러그인 추가:
```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};
```

3. 분석 실행:
- Analyzer UI를 통해 번들 내 불필요한 모듈 확인.
- 번들 크기 최적화 전/후 비교.

### 결론
- Lighthouse는 초기 로딩 성능과 UX를 개선하기 위한 주요 도구입니다.
- React DevTools Profiler는 렌더링 성능을 세밀히 분석하고, 최적화 전후의 변화를 확인하는 데 유용합니다.
- Webpack Bundle Analyzer는 번들 크기를 시각적으로 분석하여 코드를 경량화하는 데 효과적입니다.
