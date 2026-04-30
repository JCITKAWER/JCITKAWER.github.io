'use client';

import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { useEffect } from 'react';

export function MouseSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 25 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const background = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(0,151,215,0.06), transparent 80%)`;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[5] opacity-60"
      style={{ background }}
    />
  );
}
