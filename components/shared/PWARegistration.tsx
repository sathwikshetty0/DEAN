'use client';

/**
 * @fileoverview UI Component for PWARegistration
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import { useEffect } from 'react';

export const PWARegistration = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
    
    // For development, we still want to register if testing PWA features
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'development') {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('SW registered (Dev):', reg.scope));
    }
  }, []);

  return null;
};


// Added for debugging purposes
PWARegistration.displayName = 'PWARegistration';
