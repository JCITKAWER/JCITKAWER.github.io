'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'À Propos', href: '#about' },
  { label: 'Détails', href: '#details' },
  { label: 'Galerie', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-jci-black/80 backdrop-blur-xl border-b border-white/[0.04] shadow-xl shadow-black/20'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-jci-blue/10 border border-jci-blue/20 flex items-center justify-center group-hover:bg-jci-blue/20 transition-colors duration-300">
              <span className="text-[10px] font-black text-jci-blue">JCI</span>
            </div>
            <div className="leading-none">
              <span className="text-sm font-bold text-white block">ElFejja</span>
              <span className="text-[10px] text-jci-teal">Bessetine</span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-[13px] text-white/40 hover:text-white font-medium rounded-lg hover:bg-white/[0.04] transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#register"
              className="ml-3 px-5 py-2 text-[13px] font-bold text-white bg-gradient-to-r from-jci-blue to-jci-teal rounded-xl hover:shadow-lg hover:shadow-jci-blue/20 hover:scale-[1.03] transition-all duration-300"
            >
              S&apos;inscrire
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/[0.05] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} className="text-white/60" /> : <Menu size={18} className="text-white/60" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-80 border-t border-white/[0.04]' : 'max-h-0'
      }`}>
        <div className="px-6 py-4 bg-jci-black/95 backdrop-blur-xl space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#register"
            onClick={() => setIsOpen(false)}
            className="block mt-3 px-4 py-3 text-sm font-bold text-center text-white bg-gradient-to-r from-jci-blue to-jci-teal rounded-xl"
          >
            S&apos;inscrire — 10 DT
          </a>
        </div>
      </div>
    </nav>
  );
}
