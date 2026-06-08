'use client';

/**
 * @fileoverview Utility module for useNetwork
 * Implements functionality related to the D-EAN platform's core logic layer.
 */

export { useNetwork } from '@/context/NetworkContext';

/**
 * Triggers network verification when the document becomes visible
 * Useful for re-establishing connections when the app regains focus
 */
export const handleVisibilityNetworkVerification = (verify: () => void) => {
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        verify();
      }
    });
  }
};