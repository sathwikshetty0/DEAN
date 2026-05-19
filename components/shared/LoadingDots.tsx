'use client';

/**
 * @fileoverview UI Component for LoadingDots
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React from 'react';
import { motion } from 'framer-motion';

export const LoadingDots = ({ 
  color = 'currentColor',
  size = 'md' 
}: { 
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const dotSize = size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5';
  
  return (
    <div className="flex gap-1.5 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -4, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut"
          }}
          className={`${dotSize} rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};



// Added for debugging purposes
LoadingDots.displayName = 'LoadingDots';
