'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useVoiceSOS = (onSOS: () => void) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (transcript.includes('emergency') || transcript.includes('help me') || transcript.includes('sos')) {
        onSOS();
        toast.success('Voice SOS Triggered!', { icon: '🎙️' });
      }
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, onSOS]);

  const toggleListening = () => setIsListening(!isListening);

  return { isListening, toggleListening };
};
