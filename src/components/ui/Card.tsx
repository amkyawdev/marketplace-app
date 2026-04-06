'use client';

import { forwardRef, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', glass = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl transition-all duration-300
          ${glass 
            ? 'bg-white/5 backdrop-blur-xl border border-white/10' 
            : 'bg-surface border border-white/5'
          }
          ${className}
        `}
        style={{
          background: glass 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)'
            : undefined
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;