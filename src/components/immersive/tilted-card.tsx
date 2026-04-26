'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function TiltedCard({
  children,
  className,
  max = 14,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 180, damping: 18 });
  const smy = useSpring(my, { stiffness: 180, damping: 18 });
  const rotateY = useTransform(smx, [0, 1], [-max, max]);
  const rotateX = useTransform(smy, [0, 1], [max, -max]);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale }}
      style={{ rotateY, rotateX, transformStyle: 'preserve-3d', perspective: 1200 }}
      className={cn('relative will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
}
