import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';

const ListItem = lazy(() => import('./ListItem'));

function InfiniteList() {
  const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(() => {
    console.log('After isLoading =>', loading);
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, ...Array.from({ length: 10 }, (_, i) => prev.length + i + 1)]);
      setLoading(false);
    }, 1000);
  }, [loading]);

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

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMore();
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [throttle, loadMore]);

  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        {items.map((item) => (
          <ListItem key={item} item={item} />
        ))}
      </Suspense>
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
    </div>
  );
}

export default InfiniteList;
