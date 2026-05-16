'use client';

import { useEffect, useCallback } from 'react';

/** Shift+S or Ctrl+Shift+E triggers emergency flow */
export const useKeyboardSOS = (
  onTrigger: () => void,
  enabled = true
) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const isSOS =
        (e.shiftKey && e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) ||
        (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === 'e');

      if (isSOS) {
        e.preventDefault();
        onTrigger();
      }
    },
    [enabled, onTrigger]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
