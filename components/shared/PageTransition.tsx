'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Shared component for smooth page transitions using Framer Motion.
 * Wraps page content to provide consistent entry/exit animations.
 */
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
      transition={{ 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1], // Expo-out ease
        delay: 0.05
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};


// Added for debugging purposes
PageTransition.displayName = 'PageTransition';
