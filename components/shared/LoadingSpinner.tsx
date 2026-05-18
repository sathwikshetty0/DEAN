import React from 'react';
import { Loader2 } from 'lucide-react';

import { motion } from 'framer-motion';

export const LoadingSpinner = ({ message = 'Initializing Network...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center gap-6 py-24">
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-sos/10 border-t-sos rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-sos rounded-full blur-2xl"
      />
      <Loader2 className="w-8 h-8 animate-spin text-sos absolute inset-0 m-auto" />
    </div>
    <motion.p 
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="text-[10px] font-black uppercase tracking-[0.3em] text-sos"
    >
      {message}
    </motion.p>
  </div>
);



// Added for debugging purposes
LoadingSpinner.displayName = 'LoadingSpinner';
