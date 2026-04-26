'use client';

import { motion, useScroll, useTransform, type MotionStyle } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { MeshGradient, FloatingBlobs } from './effects/mesh-gradient';
import { GradientText } from './effects/gradient-text';
import { Marquee } from './effects/marquee';
import { IMG } from '@/lib/assets';
import { EVENT } from '@/lib/event';
import { Ticket as TicketIcon, ShoppingBag, Phone } from 'lucide-react';

export function SceneTickets() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  /* Three tickets fan out symmetrically as they scroll into view */
  const t1Rotate = useTransform(scrollYProgress, [0.05, 0.45], [-2, -24]);
  const t1X = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '-28%']);
  const t1Y = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '-4%']);

  const t2Y = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '-12%']);
  const t2Rotate = useTransform(scrollYProgress, [0.05, 0.45], [0, 2]);

  const t3Rotate = useTransform(scrollYProgress, [0.05, 0.45], [2, 24]);
  const t3X = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '28%']);
  const t3Y = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '-4%']);

  const headlineY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={ref} id="details" className="relative w-full overflow-x-hidden">
      <div className="relative pt-32 md:pt-44 pb-20 md:pb-32 flex flex-col gap-8 md:gap-12">
        <MeshGradient variant="default" />
        <FloatingBlobs />

        <div className="container-pro relative z-10 flex flex-col items-center gap-6 md:gap-10">
          {/* Heading */}
          <motion.div
            style={{ y: headlineY, opacity: headlineOpacity }}
            className="text-center space-y-5 max-w-2xl px-4 relative z-10"
          >
            <span className="badge badge-yellow">Billetterie</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
              <GradientText variant="jci">TICKET SALES</GradientText>
            </h2>
            <p className="text-lg md:text-2xl font-semibold text-white/80">
              <GradientText variant="gold">{EVENT.priceLabel}</GradientText>
            </p>
          </motion.div>

          {/* Ticket fan stage */}
          <div className="relative w-full max-w-4xl h-[180px] md:h-[280px] lg:h-[320px] flex items-center justify-center perspective-[1500px]">
            <TicketCard motionStyle={{ rotate: t1Rotate, x: t1X, y: t1Y, zIndex: 1 }} />
            <TicketCard motionStyle={{ rotate: t2Rotate, y: t2Y, zIndex: 3 }} highlight />
            <TicketCard motionStyle={{ rotate: t3Rotate, x: t3X, y: t3Y, zIndex: 2 }} />
          </div>

          {/* Info chips */}
          <motion.ul
            style={{ opacity: headlineOpacity }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full max-w-3xl px-4"
          >
            <InfoChip icon={TicketIcon} label="Tarif">{EVENT.priceLabel}</InfoChip>
            <InfoChip icon={ShoppingBag} label="Point de Vente">{EVENT.pointOfSale}</InfoChip>
            <InfoChip icon={Phone} label="Réservation">{EVENT.phone}</InfoChip>
          </motion.ul>
        </div>

        {/* Marquee */}
        <div className="relative z-10 w-full mt-4">
          <Marquee
            items={[EVENT.notice, EVENT.priceLabel, EVENT.phone, EVENT.pointOfSale, EVENT.dateLabel, EVENT.venue]}
          />
        </div>
      </div>
    </section>
  );
}

function TicketCard({ motionStyle, highlight = false }: { motionStyle: MotionStyle; highlight?: boolean }) {
  return (
    <motion.div style={{ ...motionStyle, transformStyle: 'preserve-3d' }} className="absolute will-change-transform">
      <div className="relative">
        <div
          className={`absolute -inset-1.5 rounded-2xl blur-xl ${
            highlight
              ? 'bg-gradient-to-tr from-jci-blue via-jci-teal to-jci-yellow opacity-55'
              : 'bg-gradient-to-tr from-jci-navy to-jci-blue opacity-30'
          }`}
        />
        <div
          className={`relative rounded-2xl overflow-hidden ring-2 shadow-2xl ${
            highlight ? 'ring-jci-blue/40 shadow-jci-blue/30' : 'ring-white/15 shadow-jci-navy/40'
          }`}
        >
          <Image
            src={IMG.TICKET}
            alt="Ticket JCI Tkawer 2.0"
            width={780}
            height={1000}
            className="h-[180px] md:h-[280px] lg:h-[320px] w-auto max-w-[280px] object-contain block mx-auto"
          />
        </div>
      </div>
    </motion.div>
  );
}

function InfoChip({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="glass-card rounded-2xl p-4 flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jci-blue/15 border border-jci-blue/30 text-jci-blue">
        <Icon size={18} />
      </span>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-jci-teal">{label}</span>
        <span className="text-sm font-bold text-white truncate">{children}</span>
      </div>
    </li>
  );
}
