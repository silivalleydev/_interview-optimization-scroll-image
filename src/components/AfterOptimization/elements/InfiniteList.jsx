import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';

// ListItem 컴포넌트를 동적으로 가져오며, Suspense를 사용해 지연 로드 처리
const ListItem = lazy(() => import('./ListItem'));

function InfiniteList() {
  // 상태: 리스트 아이템 데이터
  const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => i + 1)); // 초기 아이템 10개
  // 상태: 로딩 중 여부
  const [loading, setLoading] = useState(false);
  const [stateChanged, setstateChanged] = useState(false);

  // 새로운 데이터를 로드하는 함수
  const loadMore = useCallback(() => {
    console.log('After loading', loading);
    if (loading) return; // 이미 로딩 중이면 실행하지 않음
    setLoading(true); // 로딩 상태로 설정
    setTimeout(() => {
      // 기존 아이템에 10개의 새로운 아이템 추가
      setItems((prev) => [...prev, ...Array.from({ length: 10 }, (_, i) => prev.length + i + 1)]);
      setLoading(false); // 로딩 완료
    }, 1000); // 1초 지연 (API 호출을 시뮬레이션)
  }, [loading]);

  // 쓰로틀링 함수
  const throttle = useCallback((func, limit) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
      const now = Date.now();
      if (!lastRan) {
        func.apply(this, args);
        lastRan = now;
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (now - lastRan >= limit) {
            func.apply(this, args);
            lastRan = now;
          }
        }, limit - (now - lastRan));
      }
    };
  }, []);

  // 스크롤 이벤트 처리 함수
  const handleScroll = useCallback(() => {
    // 스크롤 위치가 문서의 하단에 가까워지면 loadMore 실행
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      loadMore(); // 데이터 로드
    }
  }, [loadMore]);

  // 스크롤 이벤트 리스너 등록 및 해제
  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 50); // 200ms 간격으로 쓰로틀링
    window.addEventListener('scroll', throttledScroll); // 스크롤 이벤트 리스너 추가
    return () => window.removeEventListener('scroll', throttledScroll); // 컴포넌트 언마운트 시 리스너 제거
  }, [throttle, handleScroll]);

  return (
    <div>
      <button onClick={() => setstateChanged(!stateChanged)}>state changed: {stateChanged}</button>
      {/* Suspense로 ListItem 컴포넌트 로딩 상태 처리 */}
      <Suspense fallback={<p>Loading...</p>}>
        {items.map((item) => (
          <ListItem key={item} item={item} /> // 각 아이템에 ListItem 컴포넌트 렌더링
        ))}
      </Suspense>
      {/* 로딩 중 상태 표시 */}
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
    </div>
  );
}

export default InfiniteList;
