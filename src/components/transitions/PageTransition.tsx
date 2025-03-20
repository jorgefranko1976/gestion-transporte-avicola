
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  appear?: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  appear = true,
}) => {
  const [isVisible, setIsVisible] = useState(!appear);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appear) {
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [appear]);

  return (
    <div
      ref={nodeRef}
      className={cn(
        'transition-all duration-500 ease-apple',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition;
