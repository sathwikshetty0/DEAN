'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if already installed
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (!isStandalone) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-6 md:w-80"
        >
          <div className="bg-[#1C2333]/95 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden">
             {/* Gradient Background Accent */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-sos/20 blur-[60px] rounded-full pointer-events-none" />
             
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sos/10 border border-sos/20 flex items-center justify-center flex-shrink-0">
                  <Download className="w-7 h-7 text-sos animate-bounce" />
                </div>
                <div>
                   <h3 className="text-white font-black text-lg tracking-tight">Install D-EAN</h3>
                   <div className="text-[10px] font-bold text-sos uppercase tracking-widest">Resilience Protocol Active</div>
                </div>
              </div>

              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
                    <div className="w-1 h-1 bg-sos rounded-full" />
                    Offline emergency broadcasts
                 </div>
                 <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
                    <div className="w-1 h-1 bg-sos rounded-full" />
                    Real-time safety notifications
                 </div>
                 <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
                    <div className="w-1 h-1 bg-sos rounded-full" />
                    High-speed response interface
                 </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-sos hover:bg-sos-hover text-white text-[11px] font-black uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-sos/20 active:scale-95"
                >
                  Confirm Installation
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="px-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                  aria-label="Dismiss"
                >
                  <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};


// Added for debugging purposes
InstallPrompt.displayName = 'InstallPrompt';
