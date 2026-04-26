'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const dotX = useSpring(x, { stiffness: 400, damping: 28 });
  const dotY = useSpring(y, { stiffness: 400, damping: 28 });
  const ringX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });
  const glowX = useSpring(x, { stiffness: 80, damping: 18, mass: 0.8 });
  const glowY = useSpring(y, { stiffness: 80, damping: 18, mass: 0.8 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduce) return;
    requestAnimationFrame(() => setEnabled(true));

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .interactive, .glass-card')) {
        setHovering(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.relatedTarget as HTMLElement | null;
      if (!target?.closest('a, button, [role="button"], .interactive, .glass-card')) {
        setHovering(false);
      }
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[201] w-1.5 h-1.5 rounded-full bg-white"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      />
      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[200] rounded-full border border-white/30 transition-[width,height] duration-300 ease-out"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
        }}
      />
      {/* Glow blob */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[90] w-[140px] h-[140px] rounded-full mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          background:
            'radial-gradient(circle, rgba(0,151,215,0.35) 0%, rgba(87,188,188,0.15) 40%, transparent 70%)',
          filter: 'blur(25px)',
        }}
      />
    </>
  );
}
