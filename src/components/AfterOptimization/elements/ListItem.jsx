import React, { useState, useEffect, useRef } from 'react';
import LazyImage from './LazyImage';

function ListItem({ item }) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            console.log('After active item =>', item)
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (itemRef.current) observer.observe(itemRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      style={{
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        background: isVisible ? '#ffffff' : '#f1f1f1',
        transition: 'background 0.3s ease',
      }}
    >
      {isVisible && (
        <>
          <LazyImage
            src={`https://via.placeholder.com/150?text=Image+${item}`}
            alt={`Image ${item}`}
          />
          <h3>Item {item}</h3>
          <p>This is the content for item {item}.</p>
        </>
      )}
    </div>
  );
}

export default ListItem;
