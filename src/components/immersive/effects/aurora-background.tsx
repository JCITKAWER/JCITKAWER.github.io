'use client';

import { cn } from '@/lib/utils';

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden
    >
      <div
        className="absolute -inset-[20%] opacity-65 [background:conic-gradient(from_90deg_at_50%_50%,#0097D7_0deg,#1F4789_90deg,#57BCBC_180deg,#EFC40F_260deg,#5BB7FF_320deg,#0097D7_360deg)] [filter:blur(130px)_saturate(1.5)] [animation:var(--animate-aurora)]"
      />
      <div
        className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_0%,rgba(10,17,48,0.45)_55%,rgba(10,17,48,0.92)_100%)]"
      />
    </div>
  );
}
