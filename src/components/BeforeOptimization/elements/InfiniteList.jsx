import React, { useState, useEffect } from 'react';
import ListItem from './ListItem';

function InfiniteList() {
  const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    console.log('Before isLoading =>', loading);
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, ...Array.from({ length: 10 }, (_, i) => prev.length + i + 1)]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div>
      {items.map((item) => (
        <ListItem key={item} item={item} />
      ))}
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
    </div>
  );
}

export default InfiniteList;
