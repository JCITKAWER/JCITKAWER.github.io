'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GradientText } from './effects/gradient-text';

export function SceneStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const words =
    'Le plus grand tournoi de football à Mornaguia. Une compétition épique organisée par JCI ElFejja Bessetine où passion, talent et esprit communautaire se rencontrent sur le terrain.'.split(
      ' '
    );

  const badgeOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const headingOpacity = useTransform(scrollYProgress, [0.02, 0.1], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0.02, 0.1], [40, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.55, 0.65], [50, 0]);

  return (
    <section ref={ref} id="about" className="relative h-[120vh] md:h-[200vh] bg-[#0A1130]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,151,215,0.18),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(87,188,188,0.12),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(31,71,137,0.15),transparent_45%)] pointer-events-none" />

        <div className="container-tight relative z-10 flex flex-col items-center text-center gap-5 md:gap-6 px-6">
          {/* Badge */}
          <motion.span style={{ opacity: badgeOpacity }} className="badge badge-teal">
            Notre Histoire
          </motion.span>

          {/* Big Heading */}
          <motion.h2
            style={{ opacity: headingOpacity, y: headingY }}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05]"
          >
            <GradientText variant="jci">{'L\'ÉVÉNEMENT'}</GradientText>
            <br />
            <GradientText variant="gold">DE L&apos;ANNÉE</GradientText>
          </motion.h2>

          {/* Word-by-word paragraph */}
          <p className="text-base md:text-xl lg:text-2xl leading-relaxed font-medium max-w-3xl">
            {words.map((word, i) => {
              const start = 0.08 + (i / words.length) * 0.4;
              const end = start + 0.4 / words.length;
              return (
                <span key={i}>
                  <WordReveal progress={scrollYProgress} range={[start, end]}>{word}</WordReveal>
                  {' '}
                </span>
              );
            })}
          </p>

          {/* Stats row */}
          <motion.div
            style={{ opacity: statsOpacity, y: statsY }}
            className="grid grid-cols-3 gap-6 md:gap-12 pt-5 md:pt-8"
          >
            <StatItem value="4" label="Équipes" />
            <StatItem value="2.0" label="Édition" />
            <StatItem value="10" label="DT Entrée" />
          </motion.div>
        </div>
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
    <motion.span style={{ opacity }} className="inline will-change-[opacity]">
      {children}
    </motion.span>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-3xl md:text-5xl lg:text-6xl font-black text-gradient-jci">{value}</span>
      <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/45">{label}</span>
    </div>
  );
}
