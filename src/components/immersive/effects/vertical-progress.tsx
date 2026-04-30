'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function VerticalScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 h-32 w-1.5 bg-white/5 rounded-full z-[100] hidden md:block">
      <motion.div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-jci-blue to-jci-teal rounded-full origin-top"
        style={{ scaleY }}
      />
      {/* Decorative dots for sections */}
      <div className="absolute inset-0 flex flex-col justify-between py-2 items-center pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-white/10" />
        ))}
      </div>
    </div>
  );
}
