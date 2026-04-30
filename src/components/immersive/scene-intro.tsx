'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { AuroraBackground } from './effects/aurora-background';
import { GradientText } from './effects/gradient-text';
import { TiltedCard } from './tilted-card';
import { IMG } from '@/lib/assets';
import { EVENT } from '@/lib/event';

/* ---------- Particle Field ---------- */
function Particles() {
  const [particles, setParticles] = useState<Array<{
    id: number; left: string; top: string; size: number;
    dur: number; delay: number; color: string; opacity: number;
  }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        dur: Math.random() * 25 + 15,
        delay: Math.random() * 15,
        color: ['#0097D7', '#57BCBC', '#5BB7FF', '#EFC40F'][i % 4],
        opacity: Math.random() * 0.4 + 0.1,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            animation: `particle-float ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Scene Intro (3D Hero) ---------- */
export function SceneIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  /* Parallax: text and mascot both drift UP together as scroll progresses */
  const textY = useTransform(scrollYProgress, [0, 1], ['0vh', '-12vh']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.85]);

  const mascotY = useTransform(scrollYProgress, [0, 1], ['0vh', '-22vh']);
  const mascotScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const mascotRotate = useTransform(scrollYProgress, [0, 1], [2, -10]);
  const mascotOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scrollInd = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative h-[100vh] overflow-hidden pb-24 md:pb-32">
      <div className="absolute inset-0 w-full h-full scene-stage">
        {/* Layer 0 — Aurora BG */}
        <motion.div style={{ scale: bgScale, opacity: bgOpacity }} className="absolute inset-0">
          <AuroraBackground />
        </motion.div>

        {/* Radial accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,151,215,0.15),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_80%,rgba(87,188,188,0.08),transparent_55%)] pointer-events-none" />

        {/* Layer 1 — Particles */}
        <Particles />

        {/* Layer 2 — Content Grid */}
        <div className="relative z-10 h-full flex items-center justify-center pt-0 pb-0">
          <div className="container-pro w-full grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12 px-6">
            {/* ——— Left: Typography ——— */}
            <motion.div
              style={{
                y: textY,
                opacity: textOpacity,
                scale: textScale,
                transformPerspective: 1200,
              }}
              className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="badge badge-teal mb-4 md:mb-6">
                  ⚽ {EVENT.dateLabel} • {EVENT.venue}
                </span>
              </motion.div>

              {/* Heading with Light Sweep */}
              <h1 className="flex flex-col uppercase font-black leading-[0.95] tracking-tight relative">
                <motion.span
                  initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-[clamp(2.5rem,10vw,8.5rem)] text-white drop-shadow-2xl"
                >
                  JCI
                </motion.span>
                <div className="relative overflow-hidden">
                  <motion.span
                    initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-[clamp(2.5rem,10vw,8.5rem)] drop-shadow-[0_0_30px_rgba(0,151,215,0.2)]"
                  >
                    <GradientText variant="jci">TKAWER</GradientText>
                  </motion.span>
                  {/* Sweep highlight */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%]"
                    animate={{ translateX: ['150%', '-150%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  />
                </div>
                <motion.span
                  initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-[clamp(2rem,8vw,6.5rem)] text-jci-yellow mt-0 md:mt-1 drop-shadow-2xl"
                >
                  2.0
                </motion.span>
              </h1>

              {/* Subtitle words */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-5 md:mt-8 text-[10px] md:text-xs text-white/40 font-bold uppercase tracking-[0.25em] md:tracking-[0.4em] max-w-[280px] md:max-w-none"
              >
                Une compétition épique organisée par JCI ElFejja Bessetine
              </motion.p>
            </motion.div>

            {/* ——— Right: 3D Mascot Card ——— */}
            <motion.div
              style={{
                y: mascotY,
                scale: mascotScale,
                rotateZ: mascotRotate,
                opacity: mascotOpacity,
                transformPerspective: 1200,
              }}
              className="flex justify-center md:justify-end order-1 md:order-2 relative"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, type: 'spring', stiffness: 90 }}
            >
              {/* Pulse glow ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] md:w-[300px] md:h-[300px] rounded-full animate-pulse-glow pointer-events-none mix-blend-screen opacity-60" />

              <TiltedCard max={12}>
                <div className="relative w-[180px] h-[240px] md:w-[320px] md:h-[430px] xl:w-[380px] xl:h-[510px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden glass-card ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,151,215,0.25)]">
                  <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent z-10 pointer-events-none" />
                  <Image
                    src={IMG.MASCOT}
                    alt="JCI Mascot"
                    fill
                    className="object-cover scale-105"
                    priority
                  />
                  <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-[#0A1130] via-[#0A1130]/80 to-transparent z-10 flex flex-col justify-end p-4 md:p-5">
                    <span className="badge badge-yellow self-end font-black text-[9px] md:text-xs drop-shadow-lg">
                      EDITION 2.0
                    </span>
                  </div>
                </div>
              </TiltedCard>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          style={{ opacity: scrollInd }}
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent"
        >
          <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-white/35">
            Scroll
          </span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-jci-teal/60 to-transparent mt-2"
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.button>
      </div>
    </section>
  );
}

