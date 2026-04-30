'use client';

import { motion, useScroll, useTransform, type MotionStyle, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { GradientText } from './effects/gradient-text';
import { Marquee } from './effects/marquee';
import { IMG } from '@/lib/assets';
import { EVENT } from '@/lib/event';
import { Ticket as TicketIcon, ShoppingBag, Phone, Sparkles } from 'lucide-react';

export function SceneTickets() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const t1Rotate = useTransform(scrollYProgress, [0.05, 0.45], [-2, -22]);
  const t1X = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '-35%']);
  const t1Y = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '-4%']);

  const t2Y = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '10%']);
  const t2Rotate = useTransform(scrollYProgress, [0.05, 0.45], [0, 1]);

  const t3Rotate = useTransform(scrollYProgress, [0.05, 0.45], [2, 22]);
  const t3X = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '35%']);
  const t3Y = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '-4%']);

  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={ref} id="tickets" className="relative min-h-screen bg-[#0A1130] overflow-hidden flex flex-col items-center justify-center py-24 gap-12 md:gap-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,151,215,0.06),transparent_70%)] pointer-events-none" />
      
      {/* 1. Header - In natural flow (No overlap possible) */}
      <motion.div 
        style={{ opacity: headlineOpacity }}
        className="relative z-10 flex flex-col items-center text-center space-y-2 px-6"
      >
        <span className="badge badge-yellow text-[10px] py-1 px-5 flex items-center gap-2">
          <Sparkles size={12} /> Billetterie
        </span>
        <h2 className="text-[clamp(2.2rem,8vw,4.5rem)] font-black leading-[0.9] uppercase tracking-tighter">
          <GradientText variant="jci">PRENEZ VOTRE</GradientText>
          <br />
          <GradientText variant="gold">TICKET MAINTENANT</GradientText>
        </h2>
      </motion.div>

      {/* 2. Ticket Stage - In natural flow */}
      <div className="relative z-0 w-full flex items-center justify-center [perspective:2500px] py-10">
        <div className="relative w-full h-[180px] md:h-[280px] flex items-center justify-center">
          <InteractiveTicketCard motionStyle={{ rotate: t1Rotate, x: t1X, y: t1Y, zIndex: 1 }} />
          <InteractiveTicketCard motionStyle={{ rotate: t2Rotate, y: t2Y, zIndex: 3 }} highlight />
          <InteractiveTicketCard motionStyle={{ rotate: t3Rotate, x: t3X, y: t3Y, zIndex: 2 }} />
        </div>
      </div>

      {/* 3. Info Area - In natural flow */}
      <motion.div
        style={{ opacity: headlineOpacity }}
        className="relative z-20 w-full max-w-5xl px-8"
      >
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-10">
          <InfoChip icon={TicketIcon} label="Tarif">{EVENT.priceLabel}</InfoChip>
          <InfoChip icon={ShoppingBag} label="Point de Vente">{EVENT.pointOfSale}</InfoChip>
          <InfoChip icon={Phone} label="Réservation">{EVENT.phone}</InfoChip>
        </ul>
      </motion.div>

      {/* 4. Marquee - Static at bottom of flow */}
      <div className="w-full z-30 mt-auto pt-10">
        <Marquee items={[EVENT.notice, EVENT.priceLabel, EVENT.phone, EVENT.pointOfSale, EVENT.dateLabel, EVENT.venue]} />
      </div>
    </section>
  );
}

function InteractiveTicketCard({ motionStyle, highlight = false }: { motionStyle: MotionStyle; highlight?: boolean }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const springX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 100, damping: 30 });

  return (
    <motion.div 
      style={{ ...motionStyle, rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }} 
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setRotateX((e.clientY - rect.top - rect.height/2) / 10);
        setRotateY((rect.width/2 - (e.clientX - rect.left)) / 10);
      }}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      className="absolute will-change-transform cursor-pointer"
    >
      <div className="relative group">
        <div className={`absolute -inset-1 rounded-xl blur-2xl transition-opacity duration-500 opacity-20 ${highlight ? 'bg-jci-yellow' : 'bg-jci-blue'}`} />
        <div className={`relative rounded-xl overflow-hidden ring-1 shadow-2xl transition-all duration-500 ${highlight ? 'ring-jci-yellow/50' : 'ring-white/10'}`}>
          <Image
            src={IMG.TICKET}
            alt="Ticket JCI"
            width={400}
            height={160}
            className="h-auto w-[120px] md:w-[180px] object-contain block"
          />
        </div>
      </div>
    </motion.div>
  );
}

function InfoChip({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <li className="glass-card rounded-2xl p-4 flex items-center gap-4 transition-transform hover:scale-105">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jci-blue/10 border border-jci-blue/20 text-jci-blue">
        <Icon size={16} />
      </span>
      <div className="flex flex-col leading-tight min-w-0 text-left">
        <span className="text-[9px] font-bold tracking-widest uppercase text-jci-teal/70 mb-0.5">{label}</span>
        <span className="text-xs md:text-sm font-bold text-white truncate">{children}</span>
      </div>
    </li>
  );
}
