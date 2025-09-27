import React, { useEffect, useState, useRef } from 'react';
import { FigureData } from '../types';

interface FigureModalProps {
  figure: FigureData;
  onClose: () => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FigureModal: React.FC<FigureModalProps> = ({ figure, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleZoom = (amount: number) => {
    setZoom(prev => Math.max(1, prev + amount));
  };
  
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      isDragging.current = true;
      startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      if (imgRef.current) imgRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (imgRef.current) imgRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      setPosition({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y
      });
    }
  };


  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in-up" 
        onClick={onClose}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
          <div className="font-sans font-bold text-primary">Figure Viewer</div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleZoom(-0.2)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">-</button>
            <button onClick={() => handleZoom(0.2)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">+</button>
            <button onClick={handleReset} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Reset</button>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
              <CloseIcon className="w-6 h-6 text-secondary" />
            </button>
          </div>
        </header>
        <div className="flex-1 p-4 overflow-hidden flex items-center justify-center bg-gray-100">
            <img 
                ref={imgRef}
                src={figure.file} 
                alt={figure.caption}
                className="transition-transform duration-100 ease-out"
                style={{ 
                    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`, 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    cursor: zoom > 1 ? 'grab' : 'default'
                }}
                onMouseDown={handleMouseDown}
            />
        </div>
        <footer className="p-4 border-t bg-gray-50 text-sm text-secondary font-sans rounded-b-lg">
          {figure.caption}
        </footer>
      </div>
    </div>
  );
};

export default FigureModal;
