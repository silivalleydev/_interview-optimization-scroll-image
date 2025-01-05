import React from 'react';

function LazyImage({ src, alt }) {
  console.log('Before image', alt)
  return <img src={src} alt={alt} style={{ width: '150px', height: '150px' }} />;
}

export default LazyImage;
