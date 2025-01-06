import React, { useState, useEffect, useRef } from 'react';
import LazyImage from './LazyImage';

function ListItem({ item }) {
  // 상태: 현재 리스트 아이템이 화면에 보이는지 여부를 관리
  const [isVisible, setIsVisible] = useState(false);

  // Ref: 해당 DOM 요소를 참조하기 위해 사용
  const itemRef = useRef();

  useEffect(() => {
    // IntersectionObserver를 생성하여 요소의 가시성을 관찰
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 요소가 뷰포트에 들어왔는지 확인
        if (entry.isIntersecting) {
          console.log('After active item =>', item); // 디버깅용 로그
          setIsVisible(true); // 가시성을 true로 설정
          observer.disconnect(); // 한 번만 관찰 후 중단
        }
      },
      {
        threshold: 0.1,// 10% 이상 요소가 보일 때 활성화
      }
    );

    // Ref로 참조된 DOM 요소를 관찰
    if (itemRef.current) observer.observe(itemRef.current);

    // 컴포넌트가 언마운트되거나 리렌더링될 때 관찰 중단
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef} // 관찰할 DOM 요소 참조
      style={{
        marginBottom: '20px', // 아이템 간 간격 설정
        minHeight: 268,
        padding: '10px', // 아이템 내부 여백
        border: '1px solid #ccc', // 아이템 경계선
        background: isVisible ? '#ffffff' : '#f1f1f1', // 가시성에 따라 배경색 변경
        transition: 'background 0.3s ease', // 배경색 변경 애니메이션
      }}
    >
      {/* 요소가 화면에 보이는 경우에만 콘텐츠 렌더링 */}
      {isVisible && (
        <>
          <LazyImage
            src={`https://via.placeholder.com/150?text=Image+${item}`} // 이미지 URL
            alt={`Image ${item}`} // 이미지 대체 텍스트
          />
          <h3>Item {item}</h3> {/* 아이템 제목 */}
          <p>This is the content for item {item}.</p> {/* 아이템 설명 */}
        </>
      )}
    </div>
  );
}

export default ListItem;
