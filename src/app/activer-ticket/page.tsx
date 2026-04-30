'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, User, Phone, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { MeshGradient, FloatingBlobs } from '@/components/immersive/effects/mesh-gradient';
import { GradientText } from '@/components/immersive/effects/gradient-text';

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
    <div className="relative min-h-screen bg-[#0A1130] selection:bg-jci-blue/30 selection:text-white overflow-x-hidden flex flex-col items-center justify-center">
      <MeshGradient variant="glow" />
      <FloatingBlobs />

      <main className="relative z-10 w-full max-w-xl px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header Section */}
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="badge badge-teal py-1 px-5 text-[10px] mb-6">Accès Officiel</span>
            <h1 className="text-[clamp(2.2rem,8vw,4.5rem)] font-black leading-[0.9] uppercase tracking-tighter mb-6">
              <GradientText variant="jci">ACTIVER</GradientText>
              <br />
              <GradientText variant="gold">VOTRE BILLET</GradientText>
            </h1>
            <p className="text-white/40 text-sm md:text-base max-w-sm leading-relaxed font-medium">
              Associez votre billet physique à votre identité pour sécuriser votre entrée au tournoi.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative mb-12 p-6 rounded-3xl text-center font-bold text-sm overflow-hidden ${
                  message.type === 'success' 
                    ? 'bg-jci-teal/10 text-jci-teal border border-jci-teal/20 shadow-[0_0_40px_rgba(87,188,188,0.1)]' 
                    : 'bg-red-500/10 text-red-300 border border-red-500/20'
                }`}
              >
                {message.type === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2], rotate: [0, 15, -15] }}
                    transition={{ duration: 1, repeat: 2 }}
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                  >
                    <div className="w-full h-full bg-[radial-gradient(circle,rgba(87,188,188,0.2)_0%,transparent_70%)]" />
                  </motion.div>
                )}
                <div className="flex items-center justify-center gap-3 relative z-10">
                  {message.type === 'success' ? <CheckCircle size={20} className="animate-bounce" /> : <AlertCircle size={20} />}
                  {message.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-1">
                  Nom Complet
                </label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Mohamed Amine" 
                  className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-5 text-white text-base focus:outline-none focus:border-jci-blue focus:bg-white/[0.06] transition-all" 
                  required 
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-1">
                  Téléphone
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="55 123 456" 
                  className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-5 text-white text-base focus:outline-none focus:border-jci-blue focus:bg-white/[0.06] transition-all" 
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-jci-yellow/50 uppercase tracking-[0.3em] px-1">
                Code de Référence (TKW-XXX)
              </label>
              <input 
                type="text" 
                name="ref" 
                placeholder="TKW-000" 
                className="w-full h-16 bg-white/[0.05] border border-white/20 rounded-2xl px-6 text-jci-yellow text-xl focus:outline-none focus:border-jci-yellow focus:bg-white/[0.08] transition-all uppercase font-mono tracking-[0.4em]" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="group relative h-20 mt-4 overflow-hidden rounded-2xl bg-jci-blue transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
              <div className="relative flex items-center justify-center gap-4 text-white">
                {loading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <span className="font-black text-lg tracking-widest uppercase">ACTIVER MAINTENANT</span>
                    <Ticket size={24} />
                  </>
                )}
              </div>
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
