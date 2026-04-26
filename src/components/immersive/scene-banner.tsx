'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { MeshGradient, FloatingBlobs } from './effects/mesh-gradient';
import { GradientText } from './effects/gradient-text';
import { TiltedCard } from './tilted-card';
import { IMG } from '@/lib/assets';
import { EVENT } from '@/lib/event';

export function SceneBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageX = useTransform(scrollYProgress, [0, 0.5, 1], ['18%', '0%', '-8%']);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -4]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 1, 1, 0.6]);
  const textY = useTransform(scrollYProgress, [0, 1], ['16%', '-16%']);

  return (
    <section ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden scene-stage flex items-center">
        <MeshGradient variant="default" />
        <FloatingBlobs />

        <div className="container-pro relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text column */}
            <motion.div
              style={{ y: textY }}
              className="order-2 lg:order-1 flex flex-col items-start gap-6 max-w-xl"
            >
              <span className="badge">Tournoi de Football</span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                <GradientText variant="jci" as="span" className="block">
                  09 MAI
                </GradientText>
                <GradientText variant="gold" as="span" className="block">
                  2026
                </GradientText>
                <span className="block text-white">{EVENT.venue}</span>
              </h2>
              <p className="text-base md:text-lg text-white/65 leading-relaxed">
                Une compétition épique organisée par{' '}
                <span className="text-jci-teal font-semibold">{EVENT.organizer}</span>.
                Réservez votre équipe, portez vos couleurs.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="pill">⚽ {EVENT.priceLabel}</span>
                <span className="pill">📞 {EVENT.phone}</span>
              </div>
            </motion.div>

            {/* Banner image column */}
            <motion.div
              style={{ x: imageX, rotate: imageRotate, opacity: imageOpacity }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <TiltedCard className="w-full max-w-xl">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-jci-blue via-jci-teal to-jci-yellow opacity-40 blur-xl" />
                  <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-2xl shadow-jci-blue/20">
                    <Image
                      src={IMG.BANNER}
                      alt="Tournoi JCI Tkawer 2.0 — banner"
                      width={1200}
                      height={680}
                      priority
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </TiltedCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
