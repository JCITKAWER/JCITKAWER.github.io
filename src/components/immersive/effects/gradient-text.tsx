'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Variant = 'jci' | 'jci-deep' | 'gold' | 'flow' | 'shimmer';

export function GradientText({
  variant = 'jci',
  className,
  children,
  as: Tag = 'span',
}: {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const map: Record<Variant, string> = {
    jci: 'text-gradient-jci',
    'jci-deep': 'text-gradient-jci-deep',
    gold: 'text-gradient-gold',
    flow: 'text-gradient-flow',
    shimmer: 'text-shimmer',
  };
  const Component = Tag as React.ElementType;
  return <Component className={cn(map[variant], className)}>{children}</Component>;
}
