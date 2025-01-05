import React from 'react';
import LazyImage from './LazyImage';

function ListItem({ item }) {
  console.log('Before item =>', item)
  return (
    <div
      style={{
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
      }}
    >
      <LazyImage
        src={`https://via.placeholder.com/150?text=Image+${item}`}
        alt={`Image ${item}`}
      />
      <h3>Item {item}</h3>
      <p>This is the content for item {item}.</p>
    </div>
  );
}

export default ListItem;
