import { useRef, useCallback, useState, useEffect } from 'react';

export function useScrollSync() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const rafRef = useRef<number | null>(null);
  const ticking = useRef(false);

  const handleScroll = useCallback((scrollTop: number) => {
    if (!ticking.current) {
      rafRef.current = requestAnimationFrame(() => {
        setScrollOffset(scrollTop);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { scrollOffset, handleScroll };
}
