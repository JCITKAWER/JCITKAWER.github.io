'use client';

import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Home, BookOpen, Image as ImageIcon, Ticket, Send, Sparkles } from 'lucide-react';

const navItems = [
  { id: 'hero', icon: Home, label: 'Accueil', color: '#0097D7' },
  { id: 'about', icon: BookOpen, label: 'Histoire', color: '#57BCBC' },
  { id: 'gallery', icon: ImageIcon, label: 'Galerie', color: '#5BB7FF' },
  { id: 'tickets', icon: Ticket, label: 'Tickets', color: '#EFC40F' },
  { id: 'cta', icon: Send, label: 'Inscrire', color: '#0097D7' },
];

export function FloatingNav() {
  const [active, setActive] = useState('hero');
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + window.innerHeight / 3;

      sections.forEach((section, i) => {
        if (section && scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
          setActive(navItems[i].id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[95vw]">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative p-1.5 px-3 rounded-full flex items-center gap-1.5 bg-black/30 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_20px_rgba(0,151,215,0.05)] ring-1 ring-white/5"
      >
        {/* Animated Active Backdrop (Liquid Pill) */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
           <div className="absolute inset-0 bg-gradient-to-tr from-jci-blue/5 to-transparent opacity-50" />
        </div>

        {navItems.map((item) => (
          <NavButton 
            key={item.id} 
            item={item} 
            active={active === item.id} 
            onClick={() => {
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        ))}

        {/* Global Progress Line */}
        <div className="absolute -bottom-2 left-8 right-8 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            style={{ scaleX: scrollYProgress }}
            className="absolute inset-0 bg-gradient-to-r from-jci-blue via-jci-teal to-jci-yellow origin-left"
          />
        </div>
      </motion.nav>
    </div>
  );
}

function NavButton({ item, active, onClick }: { item: any; active: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [mX, setMX] = useState(0);
  const [mY, setMY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMX((e.clientX - rect.left - rect.width / 2) / 3);
    setMY((e.clientY - rect.top - rect.height / 2) / 3);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setMX(0); setMY(0); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      animate={{ x: mX, y: mY }}
      className={`relative flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 rounded-full transition-all duration-700 ease-out group ${
        active ? 'text-white' : 'text-white/35 hover:text-white/70'
      }`}
    >
      {/* Liquid Active Background */}
      <AnimatePresence>
        {active && (
          <motion.div
            layoutId="activePill"
            className="absolute inset-0 bg-gradient-to-r from-jci-blue via-jci-blue to-jci-teal rounded-full z-[-1] shadow-[0_0_20px_rgba(0,151,215,0.4)]"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
             <div className="absolute inset-0 bg-white/10 animate-shimmer [background-size:200%_100%]" />
          </motion.div>
        )}
      </AnimatePresence>

      <item.icon className={`relative z-10 w-4 h-4 md:w-[18px] md:h-[18px] transition-transform duration-500 ${active ? 'scale-110 rotate-[5deg]' : 'group-hover:scale-110'}`} />
      
      {/* Label Reveal */}
      <div className={`relative z-10 flex overflow-hidden transition-all duration-700 ease-out ${active ? 'max-w-[80px] md:max-w-[100px] opacity-100 px-0.5 md:px-1' : 'max-w-0 opacity-0'}`}>
        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
          {item.label}
        </span>
      </div>

      {/* Hover Tooltip (Classic) */}
      {!active && isHovered && (
        <motion.span
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          className="absolute left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md text-[9px] font-bold text-white rounded-lg border border-white/10 shadow-2xl pointer-events-none whitespace-nowrap uppercase tracking-widest"
        >
          {item.label}
        </motion.span>
      )}
    </motion.button>
  );
}
