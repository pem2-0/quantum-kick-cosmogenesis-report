import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface ScrollAnimatorProps {
  children: ReactNode;
}

const ScrollAnimator: React.FC<ScrollAnimatorProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        // Disconnect after animation to prevent re-triggering
        if (domRef.current) {
          observer.unobserve(domRef.current);
        }
      }
    });

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimator;
