'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date('2026-05-09T09:00:00').getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const units = [
    { label: 'JOURS', value: timeLeft.days },
    { label: 'HEURES', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDES', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-start justify-center gap-2 md:gap-5">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-start gap-2 md:gap-5">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-jci-blue to-jci-teal rounded-2xl opacity-30 group-hover:opacity-60 blur-lg transition-opacity duration-500" />
              <div className="relative glass-card rounded-2xl w-16 h-20 md:w-24 md:h-28 flex items-center justify-center">
                <span className="text-3xl md:text-5xl font-black text-white tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </span>
              </div>
            </div>
            <span className="mt-3 text-[10px] md:text-xs font-semibold tracking-[0.2em] text-jci-teal uppercase">
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <div className="h-20 md:h-28 flex items-center">
              <span className="text-2xl md:text-4xl font-bold text-jci-blue animate-pulse pt-1 md:pt-3">:</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
