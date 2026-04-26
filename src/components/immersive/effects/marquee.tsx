'use client';

import { cn } from '@/lib/utils';

export function Marquee({
  items,
  className,
  separator = '✦',
}: {
  items: string[];
  className?: string;
  separator?: string;
}) {
  const loop = [...items, ...items];
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden py-3 border-y border-white/10 bg-white/[0.03] backdrop-blur-md',
        className
      )}
    >
      <div className="flex whitespace-nowrap" style={{ animation: 'var(--animate-marquee)' }}>
        {loop.map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-6 text-sm md:text-base font-bold uppercase tracking-[0.25em] text-gradient-flow"
          >
            {item}
            <span className="text-jci-blue/50 text-base">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
