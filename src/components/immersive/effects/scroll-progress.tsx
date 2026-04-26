'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.3 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #5BB7FF, #0097D7, #57BCBC, #EFC40F)',
        boxShadow: '0 0 12px rgba(0, 151, 215, 0.6)',
      }}
    />
  );
}
