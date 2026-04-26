'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { MeshGradient, FloatingBlobs } from './effects/mesh-gradient';
import { GradientText } from './effects/gradient-text';
import { TiltedCard } from './tilted-card';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { IMG } from '@/lib/assets';
import { EVENT } from '@/lib/event';
import { Calendar, MapPin, Ticket as TicketIcon, Phone, ShoppingBag, Sparkles } from 'lucide-react';

const PILLS = [
  { icon: Calendar, label: 'Date', value: EVENT.dateLabel, variant: 'blue' },
  { icon: MapPin, label: 'Lieu', value: EVENT.venue, variant: 'teal' },
  { icon: TicketIcon, label: 'Prix', value: EVENT.price, variant: 'yellow' },
  { icon: Phone, label: 'Contact', value: EVENT.phone, variant: 'blue' },
  { icon: ShoppingBag, label: 'Point de Vente', value: EVENT.pointOfSale, variant: 'teal' },
  { icon: Sparkles, label: 'Édition', value: '2.0', variant: 'yellow' },
];

export function ScenePoster() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const posterScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.78, 1, 0.95]);
  const posterY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const overlayOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.85, 1], [0, 1, 1, 0.7]);

  return (
    <section ref={ref} className="relative h-[150vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden scene-stage flex flex-col justify-center">
        <MeshGradient variant="deep" />
        <FloatingBlobs />

        <div className="container-pro relative z-10 flex flex-col items-center gap-12 md:gap-16">
          {/* Heading */}
          <motion.div style={{ opacity: overlayOpacity }} className="text-center space-y-4">
            <span className="badge">{EVENT.notice}</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              <GradientText variant="jci">L&apos;ÉVÉNEMENT OFFICIEL</GradientText>
            </h2>
          </motion.div>

          {/* Centered grid: pills | poster | pills */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-center w-full">
            <motion.ul
              style={{ opacity: overlayOpacity }}
              className="hidden lg:flex flex-col gap-3 items-end"
            >
              {PILLS.slice(0, 3).map((p) => (
                <PosterPill key={p.label} {...p} align="right" />
              ))}
            </motion.ul>

            <motion.div
              style={{ scale: posterScale, y: posterY }}
              className="justify-self-center"
            >
              <TiltedCard max={10}>
                <div className="relative">
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-jci-blue via-jci-teal to-jci-yellow opacity-50 blur-2xl" />
                  <div className="relative rounded-3xl overflow-hidden ring-2 ring-white/20 shadow-2xl shadow-jci-blue/30">
                    <Image
                      src={IMG.POSTER}
                      alt="Affiche officielle JCI Tkawer 2.0"
                      width={760}
                      height={1000}
                      className="w-[300px] md:w-[380px] h-auto"
                    />
                  </div>
                </div>
              </TiltedCard>
            </motion.div>

            <motion.ul
              style={{ opacity: overlayOpacity }}
              className="hidden lg:flex flex-col gap-3 items-start"
            >
              {PILLS.slice(3).map((p) => (
                <PosterPill key={p.label} {...p} align="left" />
              ))}
            </motion.ul>

            {/* Mobile: pills below poster in a 2-col grid */}
            <motion.ul
              style={{ opacity: overlayOpacity }}
              className="lg:hidden grid grid-cols-2 gap-3 col-span-full"
            >
              {PILLS.map((p) => (
                <PosterPill key={p.label} {...p} align="left" />
              ))}
            </motion.ul>
          </div>

          {/* Countdown */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-white/55">
              Le tournoi commence dans
            </p>
            <CountdownTimer />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PosterPill({
  icon: Icon,
  label,
  value,
  variant,
  align,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  variant: string;
  align: 'left' | 'right';
}) {
  const variantStyles: Record<string, { parent: string; accent: string }> = {
    blue: { parent: 'bg-[#5BB7FF]/10 text-[#5BB7FF] border-[#5BB7FF]/30', accent: 'text-[#5BB7FF]' },
    teal: { parent: 'bg-[#57BCBC]/10 text-[#57BCBC] border-[#57BCBC]/30', accent: 'text-[#57BCBC]' },
    yellow: { parent: 'bg-[#EFC40F]/10 text-[#EFC40F] border-[#EFC40F]/30', accent: 'text-[#EFC40F]' },
  };
  const theme = variantStyles[variant] || variantStyles.blue;
  return (
    <li
      className={`glass-card rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[200px] ${
        align === 'right' ? 'flex-row-reverse text-right' : 'text-left'
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${theme.parent}`}
      >
        <Icon size={16} />
      </span>
      <div className="flex flex-col leading-tight">
        <span
          className={`text-[10px] font-bold tracking-[0.2em] uppercase ${theme.accent}`}
        >
          {label}
        </span>
        <span className="text-sm font-bold text-white">{value}</span>
      </div>
    </li>
  );
}
