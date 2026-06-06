'use client';

/**
 * @fileoverview UI Component for MeshBackground
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React from 'react';
import { motion } from 'framer-motion';

export const MeshBackground = () => (
  <motion.div
    aria-hidden
    className="fixed inset-0 -z-20 overflow-hidden pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
  >
    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--red-sos)]/8 blur-[100px] animate-[mesh-drift_18s_ease-in-out_infinite]" />
    <motion.div
      animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-[-15%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[var(--blue-cloud)]/10 blur-[90px]"
    />
    <motion.div
      animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-[var(--orange-p2p)]/6 blur-[80px]"
    />
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }}
    />
  </motion.div>
);


// Added for debugging purposes
MeshBackground.displayName = 'MeshBackground';


export const MESH_PARTICLE_LIMITS = { lowPower: 25, highPerformance: 80 };