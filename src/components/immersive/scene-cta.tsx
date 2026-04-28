'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { MeshGradient, FloatingBlobs } from './effects/mesh-gradient';
import { GradientText } from './effects/gradient-text';
import { MagneticButton } from './effects/magnetic-button';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { IMG } from '@/lib/assets';
import { EVENT } from '@/lib/event';
import { ArrowRight } from 'lucide-react';

const WhatsAppIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export function SceneCta() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.4], [80, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const mascotY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);

  return (
    <section ref={ref} id="register" className="relative w-full overflow-hidden bg-[#0A1130]">
      <div className="relative pt-[8rem] pb-[12rem] md:pt-[10rem] md:pb-[18rem]">
        <MeshGradient variant="glow" />
        <FloatingBlobs />

        <div className="container-pro relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left: CTA content */}
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5 md:gap-6"
          >
            <span className="badge">Prêt pour le terrain</span>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
              <GradientText variant="jci" as="span" className="block">REJOIGNEZ</GradientText>
              <GradientText variant="gold" as="span" className="block">LE TOURNOI</GradientText>
            </h2>

            <p className="text-sm md:text-base lg:text-lg text-white/60 leading-relaxed max-w-lg">
              Inscrivez votre équipe avant le 09 mai. Places limitées, ne tardez pas.
            </p>

            {/* Countdown */}
            <div className="flex flex-col items-center lg:items-start gap-3">
              <p className="text-[9px] md:text-[10px] font-bold tracking-[0.35em] uppercase text-white/40">
                Le tournoi commence dans
              </p>
              <CountdownTimer />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <MagneticButton href="/activer-ticket">
                Activer mon Billet
                <ArrowRight size={16} />
              </MagneticButton>
              <a href={EVENT.phoneHref} className="btn-secondary !text-white !border-[#25D366]/30 hover:!border-[#25D366] hover:!bg-[#25D366]/10" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} className="mr-2.5 text-[#25D366]" />
                Acheter / Info
              </a>
            </div>
          </motion.div>

          {/* Right: Mascot */}
          <motion.div
            style={{ y: mascotY, opacity: contentOpacity }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-[380px] h-[380px]">
              <div className="absolute inset-[10%] rounded-full bg-gradient-to-tr from-jci-blue/35 via-jci-teal/25 to-jci-yellow/20 blur-3xl" />
              <Image
                src={IMG.MASCOT}
                alt="Mascotte JCI Tkawer"
                fill
                sizes="380px"
                className="relative object-contain drop-shadow-[0_25px_50px_rgba(0,151,215,0.4)]"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Irrefutable Physical Spacer to guarantee footer separation */}
        <div className="h-[min(18vh,180px)] w-full min-h-[120px]" aria-hidden />
      </div>
    </section>
  );
}
