import React, { useState, useEffect, useRef } from 'react';

function LazyImage({ src, alt }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            console.log('After active image =>', alt)
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      style={{
        width: '150px',
        height: '150px',
        objectFit: 'cover',
        backgroundColor: '#f1f1f1',
      }}
    />
  );
}

export default LazyImage;
