'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, User, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ActiverTicketPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const ref = (formData.get('ref') as string).toUpperCase().trim();

    try {
      const { data: ticket, error: fetchError } = await supabase
        .from('tickets')
        .select('*')
        .eq('reference', ref)
        .maybeSingle();

      if (fetchError || !ticket) {
        setMessage({ text: 'Référence de billet invalide. Vérifiez le code sur votre ticket.', type: 'error' });
        setLoading(false);
        return;
      }

      if (ticket.name) {
        setMessage({ text: 'Ce billet a déjà été activé par une autre personne.', type: 'error' });
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('tickets')
        .update({ name, phone })
        .eq('reference', ref);

      if (updateError) throw updateError;

      setMessage({ text: 'Billet activé avec succès ! Présentez votre ticket physique à l\'entrée.', type: 'success' });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erreur lors de l\'activation. Vérifiez votre connexion.', type: 'error' });
    }
    
    setLoading(false);
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/soccer-bg.png" 
          alt="Background" 
          fill 
          className="object-cover opacity-60 scale-105 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-500/10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-jci-blue to-jci-teal rounded-2xl flex items-center justify-center shadow-lg shadow-jci-blue/20">
              <Ticket className="text-white w-8 h-8" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white text-center mb-2 tracking-tight">
            ACTIVER <span className="text-transparent bg-clip-text bg-gradient-to-r from-jci-blue to-jci-teal">BILLET</span>
          </h1>
          <p className="text-white/50 text-center text-sm md:text-base mb-8">
            Associez votre identité à votre billet pour sécuriser votre entrée.
          </p>
          
          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
                  message.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <p className="text-sm font-medium leading-relaxed">{message.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-widest ml-1">
                <User className="w-3 h-3" /> Nom Complet
              </label>
              <input 
                type="text" 
                name="name" 
                placeholder="Ex: Ahmed Ben Ali" 
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-jci-blue focus:ring-1 focus:ring-jci-blue/50 transition-all text-lg" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-widest ml-1">
                <Phone className="w-3 h-3" /> Téléphone
              </label>
              <input 
                type="tel" 
                name="phone" 
                placeholder="Ex: 52 781 301" 
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-jci-blue focus:ring-1 focus:ring-jci-blue/50 transition-all text-lg" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-widest ml-1">
                <Ticket className="w-3 h-3" /> Référence du Billet
              </label>
              <input 
                type="text" 
                name="ref" 
                placeholder="Ex: TKW-001" 
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-jci-blue focus:ring-1 focus:ring-jci-blue/50 transition-all text-lg uppercase font-mono" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="relative group w-full overflow-hidden rounded-2xl bg-gradient-to-r from-jci-blue to-jci-teal p-px transition-all duration-300 hover:shadow-[0_0_20px_rgba(30,174,219,0.3)] disabled:opacity-50"
            >
              <div className="relative flex items-center justify-center gap-2 bg-black/10 group-hover:bg-transparent px-6 py-5 rounded-[15px] transition-all duration-300">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <span className="text-white font-black uppercase tracking-wider text-xl group-hover:scale-105 transition-transform duration-300">
                    ACTIVER MAINTENANT
                  </span>
                )}
              </div>
            </button>
          </form>

          <p className="mt-8 text-center text-white/30 text-xs">
            © 2026 JCI ElFejja Bessetine. Tous droits réservés.
          </p>
        </div>
      </motion.div>
    </main>
  );
}

