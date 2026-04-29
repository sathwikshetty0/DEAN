'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const LoadingDots = ({ color = 'currentColor' }: { color?: string }) => {
  return (
    <div className="flex gap-1 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};
