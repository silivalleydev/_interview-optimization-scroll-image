import React, { useState, useEffect, useRef } from 'react';

function LazyImage({ src, alt }) {
  // 상태: 이미지가 현재 화면에 보이는지 여부를 관리
  const [isVisible, setIsVisible] = useState(false);
  // Ref: DOM 요소에 직접 접근하기 위해 사용
  const imgRef = useRef();

  useEffect(() => {
    // IntersectionObserver를 사용하여 요소의 가시성을 관찰
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 요소가 뷰포트에 들어왔는지 확인
        if (entry.isIntersecting) {
          console.log('After active image =>', alt); // 디버깅용 로그
          setIsVisible(true); // 이미지 로드 활성화
          observer.disconnect(); // 한 번만 관찰 후 중단
        }
      },
      { threshold: 0.1 } // 10% 이상 보이면 활성화
    );

    // Ref가 연결된 DOM 요소를 관찰
    if (imgRef.current) observer.observe(imgRef.current);

    // 컴포넌트가 언마운트되거나 다시 렌더링될 때 관찰 중단
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef} // DOM 요소를 참조
      src={isVisible ? src : undefined} // 가시성에 따라 이미지를 로드
      alt={alt} // 대체 텍스트
      style={{
        width: '150px', // 고정 너비
        height: '150px', // 고정 높이
        objectFit: 'cover', // 이미지 비율 유지 및 잘림 처리
        backgroundColor: '#f1f1f1', // 로드 전 배경색 (플레이스홀더 효과)
      }}
    />
  );
}

export default LazyImage;
