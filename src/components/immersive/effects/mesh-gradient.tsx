'use client';

import { cn } from '@/lib/utils';

type Variant = 'default' | 'deep' | 'glow';

export function MeshGradient({
  variant = 'default',
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const variantClass =
    variant === 'deep' ? 'mesh-bg-deep' : variant === 'glow' ? 'mesh-bg-glow' : '';
  return <div className={cn('mesh-bg', variantClass, className)} aria-hidden />;
}

export function FloatingBlobs({ className }: { className?: string }) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden
    >
      <div
        className="blob"
        style={{
          width: 520,
          height: 520,
          left: '-8%',
          top: '12%',
          background: 'radial-gradient(circle at 30% 30%, #0097D7, transparent 70%)',
          animationDelay: '0s',
        }}
      />
      <div
        className="blob"
        style={{
          width: 440,
          height: 440,
          right: '-6%',
          top: '8%',
          background: 'radial-gradient(circle at 60% 40%, #1F4789, transparent 70%)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="blob"
        style={{
          width: 580,
          height: 580,
          left: '20%',
          bottom: '-12%',
          background: 'radial-gradient(circle at 50% 50%, #57BCBC, transparent 70%)',
          animationDelay: '-12s',
        }}
      />
      <div
        className="blob"
        style={{
          width: 360,
          height: 360,
          right: '20%',
          bottom: '-6%',
          background: 'radial-gradient(circle at 40% 60%, #5BB7FF, transparent 75%)',
          animationDelay: '-18s',
        }}
      />
    </div>
  );
}
