'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GradientText } from './effects/gradient-text';
import { MagneticButton } from './effects/magnetic-button';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { MeshGradient } from './effects/mesh-gradient';

export function SceneCta() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.4], [50, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section ref={ref} id="cta" className="relative min-h-screen bg-[#0A1130] overflow-hidden flex flex-col items-center justify-center py-24 gap-12 md:gap-20">
      <div className="absolute inset-0">
        <MeshGradient variant="default" />
        <div className="absolute inset-0 bg-jci-blue/15 animate-pulse-glow opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,151,215,0.1),transparent_60%)]" />
      </div>

      <div className="container-pro relative z-10 flex flex-col items-center text-center gap-10 md:gap-16 px-6">
        <motion.div
          style={{ opacity: headingOpacity, y: headingY }}
          className="flex flex-col items-center gap-4"
        >
          <span className="badge badge-teal py-1 px-5 text-[10px]">Prêt pour le terrain?</span>
          <h2 className="text-[clamp(2.2rem,8vw,4.5rem)] font-black leading-[0.85] uppercase tracking-tighter drop-shadow-[0_20px_50px_rgba(0,151,215,0.3)]">
            <GradientText variant="jci">INSCRIVEZ-VOUS</GradientText>
            <br />
            <GradientText variant="gold">AUJOURD&apos;HUI</GradientText>
          </h2>
          <p className="mt-4 text-white/40 text-base md:text-lg font-bold uppercase tracking-[0.4em]">
            Le moment est venu.
          </p>
        </motion.div>

        <motion.div 
          style={{ opacity: headingOpacity }}
          className="flex flex-col items-center gap-10"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30">Lancement dans</p>
            <CountdownTimer />
          </div>

          <MagneticButton>
            <a
              href="/activer-ticket"
              className="px-12 py-6 bg-jci-blue text-white font-black rounded-full text-base md:text-lg shadow-[0_0_40px_rgba(0,151,215,0.4)] hover:scale-105 transition-transform"
            >
              S&apos;INSCRIRE MAINTENANT
            </a>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Spacer for bottom air */}
      <div className="h-10 md:h-20" />
    </section>
  );
}
