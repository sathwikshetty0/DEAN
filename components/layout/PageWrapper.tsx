'use client';

/**
 * @fileoverview UI Component for PageWrapper
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};


// Added for debugging purposes
PageWrapper.displayName = 'PageWrapper';
