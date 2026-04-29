'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { GALLERY_IMAGES } from '@/lib/assets';
import { GradientText } from './effects/gradient-text';

export function SceneGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(3000);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const calc = () => {
      if (galleryRef.current) {
        const totalWidth = galleryRef.current.scrollWidth;
        const vw = window.innerWidth;
        setScrollRange(Math.max(totalWidth - vw + 80, 0));
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const x = useTransform(scrollYProgress, [0.06, 0.92], [0, -scrollRange]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.12], [50, 0]);

  return (
    <section ref={sectionRef} id="gallery" className="relative h-[220vh] md:h-[350vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center bg-[#0A1130]">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,151,215,0.14),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(87,188,188,0.08),transparent_45%)] pointer-events-none" />

        {/* Section heading */}
        <motion.div
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="relative z-10 w-full flex flex-col items-center text-center mb-5 md:mb-8 shrink-0 px-6"
        >
          <span className="badge badge-teal mb-3">Galerie</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight">
            <GradientText variant="jci">NOUS EN ACTION</GradientText>
          </h2>
          <p className="mt-3 text-white/50 text-sm md:text-base font-medium max-w-lg mx-auto text-center">
            Les meilleurs moments capturés sur le terrain.
          </p>
        </motion.div>

        {/* Horizontal gallery strip */}
        <div className="relative flex-1 min-h-0 flex items-center overflow-hidden">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-r from-[#0A1130] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-l from-[#0A1130] to-transparent z-20 pointer-events-none" />

          {/* Ambient glow behind cards */}
          <div className="absolute inset-0 bg-jci-blue/10 blur-[80px] pointer-events-none rounded-full scale-150" />

          <motion.div
            ref={galleryRef}
            style={{ x }}
            className="flex gap-5 md:gap-8 pl-12 md:pl-24 pr-12 md:pr-24 items-center will-change-transform"
          >
            {GALLERY_IMAGES.map((src, i) => (
              <GalleryCard key={i} src={src} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ src, index }: { src: string; index: number }) {
  const tiltY = index % 2 === 0 ? -4 : 4;
  const tiltX = index % 3 === 0 ? 3 : -3;

  return (
    <div
      className="relative shrink-0 group"
      style={{ transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}
    >
      <div className="relative w-[200px] h-[270px] md:w-[320px] md:h-[420px] lg:w-[360px] lg:h-[460px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden ring-1 ring-white/10 shadow-2xl transition-all duration-500 group-hover:-translate-y-3 group-hover:ring-jci-teal/40 group-hover:shadow-jci-teal/25">
        <Image
          src={src}
          alt={`JCI Tkawer moment ${index + 1}`}
          fill
          sizes="(max-width: 768px) 200px, (max-width: 1024px) 320px, 360px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080e28]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Card number */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-jci-teal/80">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
