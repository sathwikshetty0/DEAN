'use client';

/**
 * @fileoverview Utility module for useEmergencyTone
 * Implements functionality related to the D-EAN platform's core logic layer.
 */

import { useCallback, useRef } from 'react';

const TONE_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';

export const useEmergencyTone = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((volume = 0.7) => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(TONE_URL);
      }
      audioRef.current.volume = volume;
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    } catch {
      /* autoplay blocked */
    }
  }, []);

  return { play };
};
