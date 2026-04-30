'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GradientText } from './effects/gradient-text';

export function SceneStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const words =
    'Le plus grand tournoi de football à Mornaguia. Une compétition épique organisée par JCI ElFejja Bessetine où passion, talent et esprit communautaire se rencontrent sur le terrain.'.split(
      ' '
    );

  const badgeOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const headingOpacity = useTransform(scrollYProgress, [0.02, 0.1], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0.02, 0.1], [30, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.55, 0.65], [40, 0]);

  return (
    <section ref={ref} id="about" className="relative min-h-screen bg-[#0A1130] flex flex-col items-center justify-center py-32 md:py-48 overflow-hidden">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,151,215,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(87,188,188,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(31,71,137,0.12),transparent_60%)] pointer-events-none" />

      <div className="container-tight relative z-10 flex flex-col items-center text-center gap-6 md:gap-10 px-6">
          {/* Badge */}
          <motion.span style={{ opacity: badgeOpacity }} className="badge badge-teal py-1 px-5 text-[10px]">
            Notre Histoire
          </motion.span>

          {/* Big Heading - Balanced scale */}
          <motion.h2
            style={{ opacity: headingOpacity, y: headingY }}
            className="text-[clamp(2.2rem,8vw,4.5rem)] font-black leading-[0.95] uppercase tracking-tighter"
          >
            <GradientText variant="jci">{'L\'ÉVÉNEMENT'}</GradientText>
            <br />
            <GradientText variant="gold">DE L&apos;ANNÉE</GradientText>
          </motion.h2>

          {/* Word-by-word paragraph - Balanced scale */}
          <div className="max-w-3xl mt-2 relative">
            <div className="absolute -inset-x-6 -inset-y-3 bg-jci-blue/5 blur-xl rounded-full -z-10" />
            <p className="text-lg md:text-2xl lg:text-3xl leading-snug font-black text-white/95">
              {words.map((word, i) => {
                const start = 0.05 + (i / words.length) * 0.3;
                const end = start + 0.3 / words.length;
                return (
                  <span key={i}>
                    <WordReveal progress={scrollYProgress} range={[start, end]}>{word}</WordReveal>
                    {' '}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Stats row */}
          <motion.div
            style={{ opacity: statsOpacity, y: statsY }}
            className="grid grid-cols-3 gap-6 md:gap-12 pt-4 md:pt-6"
          >
            <StatItem value="4" label="Équipes" />
            <StatItem value="2.0" label="Édition" />
            <StatItem value="10" label="DT Entrée" />
          </motion.div>
        </div>
    </section>
  );
}

function WordReveal({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}
    </motion.span>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="h-stat text-gradient-jci">{value}</span>
      <span className="text-eyebrow text-white/45">{label}</span>
    </div>
  );
}
