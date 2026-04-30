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
        className="blob w-[520px] h-[520px] -left-[8%] top-[12%] [background:radial-gradient(circle_at_30%_30%,#0097D7,transparent_70%)] [animation-delay:0s]"
      />
      <div
        className="blob w-[440px] h-[440px] -right-[6%] top-[8%] [background:radial-gradient(circle_at_60%_40%,#1F4789,transparent_70%)] [animation-delay:-6s]"
      />
      <div
        className="blob w-[580px] h-[580px] left-[20%] -bottom-[12%] [background:radial-gradient(circle_at_50%_50%,#57BCBC,transparent_70%)] [animation-delay:-12s]"
      />
      <div
        className="blob w-[360px] h-[360px] right-[20%] -bottom-[6%] [background:radial-gradient(circle_at_40%_60%,#5BB7FF,transparent_75%)] [animation-delay:-18s]"
      />
    </div>
  );
}
