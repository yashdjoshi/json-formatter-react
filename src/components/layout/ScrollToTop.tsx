import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

export function ScrollToTop({ targetRef }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const handleScroll = () => {
      const scrollTop = target.scrollTop;

      if (scrollTop > 100) {
        setIsVisible(true);

        // Clear existing timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }

        // Hide after 2 seconds of no scrolling
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      } else {
        setIsVisible(false);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      }
    };

    target.addEventListener('scroll', handleScroll);

    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [targetRef]);

  const handleClick = () => {
    targetRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      size="icon"
      onClick={handleClick}
      className={cn(
        'absolute top-2 right-2 z-10 shadow-lg transition-all duration-200',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2 pointer-events-none'
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
