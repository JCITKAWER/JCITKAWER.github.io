import Image from 'next/image';
import { IMG } from '@/lib/assets';
import { EVENT } from '@/lib/event';
import { GradientText } from './effects/gradient-text';
import { MapPin, Calendar, Hash } from 'lucide-react';

const FacebookIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" stroke="none" color={color} className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const WhatsAppIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" stroke="none" color={color} className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function SceneFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[#0A1130] border-t border-white/5 pb-24">
      {/* Background Enhancements */}
      <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(ellipse_at_top,rgba(0,151,215,0.08),transparent_70%)] pointer-events-none" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jci-blue via-jci-teal via-white/10 to-transparent" />

      <div className="container-pro pt-40 pb-32 md:pt-60 md:pb-52 grid grid-cols-1 md:grid-cols-3 gap-12 items-start relative z-10">
        {/* Brand */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5">
          <div className="relative shrink-0">
            <div className="absolute -inset-2 bg-jci-blue/20 blur-xl rounded-full" />
            <Image src={IMG.LOGO} alt={EVENT.organizer} width={72} height={72} className="relative rounded-2xl ring-1 ring-white/10 shadow-2xl" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold text-base md:text-lg">{EVENT.organizer}</p>
            <p className="text-white/45 text-[10px] tracking-wider uppercase font-semibold">JCI Tunisia • ElFejja Bessetine</p>
          </div>
        </div>

        {/* Contact */}
        <ul className="grid grid-cols-1 gap-3.5 text-sm md:justify-self-center w-full max-w-sm md:max-w-none mx-auto md:mx-0">
          <li><FooterItem icon={Calendar} accent="#5BB7FF">{EVENT.dateLabel}</FooterItem></li>
          <li><FooterItem icon={MapPin} accent="#57BCBC">{EVENT.venue}</FooterItem></li>
          <li><FooterItem icon={WhatsAppIcon} accent="#25D366" href={EVENT.phoneHref}>WhatsApp — {EVENT.phone}</FooterItem></li>
          <li><FooterItem icon={FacebookIcon} accent="#1877F2" href="https://www.facebook.com/61571810806339">Facebook Page</FooterItem></li>
        </ul>

        {/* Hashtag + copyright */}
        <div className="text-center md:text-right space-y-4">
          <p className="text-2xl md:text-3xl font-black flex items-center justify-center md:justify-end gap-2">
            <Hash size={22} className="text-jci-blue" />
            <GradientText variant="jci">JCITKAWER2</GradientText>
          </p>
          <div className="space-y-1">
            <p className="text-white/35 text-[10px] tracking-[0.3em] uppercase font-bold">
              © 2026 JCI ELFEJJA BESSETINE
            </p>
            <p className="text-white/18 text-[9px] uppercase tracking-widest">
              Designed for the future of Tunisian Football
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterItem({
  icon: Icon,
  accent,
  href,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  accent: string;
  href?: string;
  children: React.ReactNode;
}) {
  const content = (
    <span className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors duration-300">
      <Icon size={15} color={accent} />
      {children}
    </span>
  );
  return href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{content}</a> : content;
}
