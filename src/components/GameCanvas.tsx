import React, { forwardRef } from 'react';

interface GameCanvasProps {
  className?: string;
}

export const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ className = '' }, ref) => {
    return (
      <canvas
        ref={ref}
        className={`fixed inset-0 w-full h-full ${className}`}
        style={{ 
          zIndex: 1,
          background: 'transparent'
        }}
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';