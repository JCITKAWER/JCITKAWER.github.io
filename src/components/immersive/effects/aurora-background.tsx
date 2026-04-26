'use client';

import { cn } from '@/lib/utils';

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden
    >
      <div
        className="absolute -inset-[20%] opacity-65"
        style={{
          background:
            'conic-gradient(from 90deg at 50% 50%, #0097D7 0deg, #1F4789 90deg, #57BCBC 180deg, #EFC40F 260deg, #5BB7FF 320deg, #0097D7 360deg)',
          filter: 'blur(130px) saturate(1.5)',
          animation: 'var(--animate-aurora)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(10,17,48,0.45) 55%, rgba(10,17,48,0.92) 100%)',
        }}
      />
    </div>
  );
}
