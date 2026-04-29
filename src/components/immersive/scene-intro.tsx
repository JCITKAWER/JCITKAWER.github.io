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
    requestAnimationFrame(() => {
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
    });
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

  /* Multi-layer parallax speeds */
  const textY = useTransform(scrollYProgress, [0, 1], ['0vh', '35vh']);
  const textZ = useTransform(scrollYProgress, [0, 1], [0, 1000]);
  const textRotateX = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.85]);

  const mascotY = useTransform(scrollYProgress, [0, 1], ['0vh', '-45vh']);
  const mascotScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);
  const mascotRotate = useTransform(scrollYProgress, [0, 1], [3, -18]);
  const mascotOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scrollInd = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden scene-stage">
        {/* Layer 0 — Aurora BG */}
        <motion.div style={{ scale: bgScale, opacity: bgOpacity }} className="absolute inset-0">
          <AuroraBackground />
        </motion.div>

        {/* Radial accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,151,215,0.2),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_80%,rgba(87,188,188,0.1),transparent_50%)] pointer-events-none" />

        {/* Layer 1 — Particles */}
        <Particles />

        {/* Layer 2 — Content Grid */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container-pro w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-10 lg:gap-12">
            {/* ——— Left: Typography ——— */}
            <motion.div
              style={{
                y: textY,
                z: textZ,
                rotateX: textRotateX,
                opacity: textOpacity,
                scale: textScale,
                transformPerspective: 1200,
              }}
              className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="badge badge-teal mb-5 md:mb-8">
                  ⚽ {EVENT.dateLabel} • {EVENT.venue}
                </span>
              </motion.div>

              {/* Heading */}
              <h1 className="flex flex-col uppercase font-black leading-[1.05] tracking-tight">
                <motion.span
                  initial={{ y: 60, opacity: 0, filter: 'blur(12px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className="text-[clamp(3.2rem,10vw,10rem)] text-white drop-shadow-2xl"
                >
                  JCI
                </motion.span>
                <motion.span
                  initial={{ y: 60, opacity: 0, filter: 'blur(12px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-[clamp(3.2rem,10vw,10rem)]"
                >
                  <GradientText variant="jci">TKAWER</GradientText>
                </motion.span>
                <motion.span
                  initial={{ y: 60, opacity: 0, filter: 'blur(12px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1, delay: 0.35 }}
                  className="text-[clamp(2.6rem,8vw,8rem)] text-jci-yellow mt-1 md:mt-2"
                >
                  2.0
                </motion.span>
              </h1>

              {/* Subtitle words */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-5 md:mt-8 text-[11px] md:text-sm text-white/45 font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-[320px] md:max-w-none"
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
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, type: 'spring', stiffness: 80 }}
            >
              {/* Pulse glow ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full animate-pulse-glow pointer-events-none mix-blend-screen" />

              <TiltedCard max={15}>
                <div className="relative w-[220px] h-[300px] md:w-[340px] md:h-[450px] xl:w-[420px] xl:h-[560px] rounded-[2rem] overflow-hidden glass-card ring-1 ring-white/20 shadow-[0_20px_60px_rgba(0,151,215,0.35)]">
                  <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent z-10 pointer-events-none" />
                  <Image
                    src={IMG.MASCOT}
                    alt="JCI Mascot"
                    fill
                    className="object-cover scale-110"
                    priority
                  />
                  <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#0A1130] via-[#0A1130]/80 to-transparent z-10 flex flex-col justify-end p-4 md:p-6">
                    <span className="badge badge-yellow self-end font-black drop-shadow-lg">
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
