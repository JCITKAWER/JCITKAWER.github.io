'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, User, Phone, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { MeshGradient, FloatingBlobs } from '@/components/immersive/effects/mesh-gradient';
import { GradientText } from '@/components/immersive/effects/gradient-text';
import { SceneFooter } from '@/components/immersive/scene-footer';

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
    <div className="relative min-h-screen bg-jci-black selection:bg-jci-blue/30 selection:text-white overflow-x-hidden">
      <MeshGradient variant="glow" />
      <FloatingBlobs />

      <main className="container-pro relative z-10 pt-24 pb-32 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl"
        >
          <div className="flex flex-col items-center mb-10">
            <span className="badge mb-4">Accès Officiel</span>
            <h1 className="text-4xl md:text-6xl font-black text-center leading-[0.95] tracking-tight mb-4">
              <GradientText variant="jci" as="span" className="block">ACTIVER VOTRE</GradientText>
              <GradientText variant="gold" as="span" className="block text-3xl md:text-5xl">BILLET PHYSIQUE</GradientText>
            </h1>
            <p className="text-white/50 text-center text-sm md:text-base max-w-md">
              Lie ton billet à ton identité pour garantir la validité de ton entrée au tournoi.
            </p>
          </div>

          <div className="glass-card p-8 md:p-12 rounded-[24px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-jci-blue/10 blur-[60px] rounded-full pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {message && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mb-8 p-5 rounded-2xl flex items-start gap-4 ${
                    message.type === 'success' 
                      ? 'bg-jci-teal/10 text-jci-teal border border-jci-teal/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                  <p className="text-sm font-semibold">{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="space-y-7">
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                  <User size={12} className="text-jci-blue" /> Nom & Prénom
                </label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Ex: Mohamed Amine" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-jci-blue/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-jci-blue/5 hover:border-white/20 transition-all duration-300 shadow-inner" 
                  required 
                />
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                  <Phone size={12} className="text-jci-blue" /> Numéro de téléphone
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Ex: 55 123 456" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-jci-blue/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-jci-blue/5 hover:border-white/20 transition-all duration-300 shadow-inner" 
                  required 
                />
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                  <Ticket size={12} className="text-jci-yellow" /> Réf. Billet (Code au dos)
                </label>
                <input 
                  type="text" 
                  name="ref" 
                  placeholder="TKW-XXX" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-jci-yellow/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-jci-yellow/5 hover:border-white/20 transition-all duration-300 shadow-inner uppercase font-mono tracking-widest" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-3 group/btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>ACTIVER MON BILLET</span>
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      <SceneFooter />
    </div>
  );
}
