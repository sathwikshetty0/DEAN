'use client';

/**
 * @fileoverview Utility module for useNetwork
 * Implements functionality related to the D-EAN platform's core logic layer.
 */

export { useNetwork } from '@/context/NetworkContext';


export const handleVisibilityNetworkVerification = (verify: () => void) => { if (typeof document !== 'undefined') { document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') verify(); }); } };