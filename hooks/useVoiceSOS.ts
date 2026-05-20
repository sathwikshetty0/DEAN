'use client';

/**
 * @fileoverview Utility module for useVoiceSOS
 * Implements functionality related to the D-EAN platform's core logic layer.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const TRIGGERS = ['emergency', 'help me', 'sos', 'save me', 'help', 'ಬಚಾವು', 'ಸಹಾಯ'];

export const useVoiceSOS = (onSOS: () => void, enabled = true) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const onSOSRef = useRef(onSOS);
  onSOSRef.current = onSOS;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
  }, []);

  useEffect(() => {
    if (!enabled || !isListening || typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (TRIGGERS.some((t) => transcript.includes(t))) {
        onSOSRef.current();
        toast.success('Voice SOS triggered!', { icon: '🎙️' });
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition stopped');
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
    };
  }, [isListening, enabled]);

  const toggleListening = useCallback(() => {
    if (!supported) {
      toast.error('Voice SOS not supported in this browser');
      return;
    }
    setIsListening((v) => {
      if (!v) toast('Listening for "help", "SOS", or "emergency"…', { icon: '🎙️', duration: 4000 });
      return !v;
    });
  }, [supported]);

  return { isListening, toggleListening, supported };
};
