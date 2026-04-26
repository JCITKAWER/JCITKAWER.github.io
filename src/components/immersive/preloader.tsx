'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { IMG } from '@/lib/assets';

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = '';
    }, 2800);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0A1130]"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,151,215,0.15),transparent_60%)] pointer-events-none" />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-jci-blue/20 blur-2xl rounded-full animate-pulse" />
            <Image
              src={IMG.LOGO}
              alt="JCI"
              width={80}
              height={80}
              className="relative rounded-2xl ring-1 ring-white/10 shadow-2xl"
              priority
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-6 text-2xl md:text-3xl font-black tracking-tight"
          >
            <span className="text-white">JCI </span>
            <span className="text-gradient-jci">TKAWER</span>
            <span className="text-jci-yellow"> 2.0</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-2 text-[10px] font-bold tracking-[0.3em] uppercase text-white/40"
          >
            Tournoi de Football
          </motion.p>

          {/* Progress bar */}
          <div className="mt-8 h-[2px] w-48 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #0097D7, #57BCBC, #EFC40F)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
