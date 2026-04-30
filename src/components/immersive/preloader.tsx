'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { IMG } from '@/lib/assets';
import Image from 'next/image';

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[1000] bg-[#0A1130] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated Background Atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,151,215,0.1),transparent_70%)]" />
          
          {/* Center Logo/Mascot Pulse */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-12"
          >
            <div className="absolute inset-0 bg-jci-blue/20 blur-3xl rounded-full animate-pulse" />
            <Image 
              src={IMG.LOGO} 
              alt="JCI Logo" 
              width={100} 
              height={100} 
              className="relative rounded-2xl shadow-2xl ring-1 ring-white/10" 
            />
          </motion.div>

          {/* Progress Container */}
          <div className="relative w-64 md:w-80 h-1 bg-white/5 rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute h-full bg-gradient-to-r from-jci-blue via-jci-teal to-jci-yellow"
            />
          </div>

          {/* Loading Stats / Text */}
          <div className="flex flex-col items-center gap-2">
            <motion.p 
              className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Initialisation du Terrain
            </motion.p>
            <p className="text-2xl font-black text-white tabular-nums">
              {Math.floor(progress)}<span className="text-jci-teal text-sm ml-1">%</span>
            </p>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-white/5" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-white/5" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
