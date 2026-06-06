'use client';

/**
 * @fileoverview Utility module for useVoiceFeedback
 * Implements functionality related to the D-EAN platform's core logic layer.
 */

import { useCallback } from 'react';

export const useVoiceFeedback = () => {
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
};