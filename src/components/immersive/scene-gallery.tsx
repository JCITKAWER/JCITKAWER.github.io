'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { GALLERY_IMAGES } from '@/lib/assets';
import { GradientText } from './effects/gradient-text';

export function SceneGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const xRaw = useTransform(scrollYProgress, [0, 1], ['50%', '-50%']);
  const x = useSpring(xRaw, { stiffness: 60, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} id="gallery" className="relative min-h-screen overflow-hidden bg-[#0A1130] flex flex-col items-center justify-center py-24 gap-12 md:gap-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,151,215,0.08),transparent_70%)] pointer-events-none" />

      {/* Header - Natural Flow */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center text-center space-y-2 px-6"
      >
        <span className="badge badge-teal text-[10px] py-1 px-5">Galerie</span>
        <h2 className="text-[clamp(2.2rem,8vw,4.5rem)] font-black leading-[0.95] uppercase tracking-tighter">
          <GradientText variant="jci">NOUS EN ACTION</GradientText>
        </h2>
      </motion.div>

      {/* Gallery Strip - Natural Flow */}
      <div className="relative w-full overflow-hidden py-4">
        <motion.div
          style={{ x, opacity }}
          className="flex gap-4 md:gap-12 px-12 md:px-24 items-center"
        >
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} className="relative shrink-0 group">
              <span className="absolute -top-4 left-2 text-[8px] font-black text-white/20 tracking-widest uppercase">
                IMG — 0{i + 1}
              </span>

              <div className="relative w-[150px] h-[200px] md:w-[260px] md:h-[350px] rounded-xl md:rounded-[2rem] overflow-hidden ring-1 ring-white/10 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:ring-jci-teal/40">
                <Image
                  src={src}
                  alt={`JCI moment ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 150px, 350px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Spacer for bottom air */}
      <div className="h-10 md:h-20" />
    </section>
  );
}
