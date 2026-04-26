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

      <main className="container-pro relative z-10 pt-40 pb-20 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center mb-16 lg:mb-24">
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="badge mb-6 px-6 py-2 text-xs"
            >
              Accès Officiel • JCI TKAWER
            </motion.span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-center leading-[0.9] tracking-tighter mb-8 uppercase">
              <GradientText variant="jci" as="span" className="block">ACTIVER</GradientText>
              <GradientText variant="gold" as="span" className="block">BILLET</GradientText>
            </h1>
            <p className="text-white/40 text-center text-base md:text-xl max-w-md leading-relaxed font-medium">
              Veuillez lier votre billet électronique à votre identité pour accéder au stage.
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-10 md:p-16 lg:p-20 rounded-[32px] md:rounded-[48px] relative overflow-hidden shadow-[0_32px_120px_rgba(0,10,20,0.8)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-jci-blue/30 to-transparent" />
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-jci-blue/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-jci-teal/5 blur-[120px] rounded-full pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mb-12 p-8 rounded-3xl flex items-start gap-6 ${
                    message.type === 'success' 
                      ? 'bg-jci-teal/10 text-jci-teal border border-jci-teal/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${message.type === 'success' ? 'bg-jci-teal/20' : 'bg-red-500/20'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-8 h-8 shrink-0" /> : <AlertCircle className="w-8 h-8 shrink-0" />}
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-xl uppercase tracking-tight">{message.type === 'success' ? 'Succès!' : 'Attention'}</p>
                    <p className="text-base font-medium opacity-90 leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="space-y-12">
              <div className="space-y-6">
                <label className="flex items-center gap-3 text-[12px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">
                  <User size={14} className="text-jci-blue" /> Informations Personnelles
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Nom & Prénom" 
                      autoComplete="off"
                      className="w-full h-20 bg-white/[0.02] border border-white/10 rounded-2xl px-8 text-white placeholder-white/20 focus:outline-none focus:border-jci-blue/50 focus:bg-white/[0.08] focus:ring-8 focus:ring-jci-blue/5 hover:bg-white/[0.04] transition-all duration-500 shadow-inner text-lg font-bold" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Téléphone" 
                      autoComplete="off"
                      className="w-full h-20 bg-white/[0.02] border border-white/10 rounded-2xl px-8 text-white placeholder-white/20 focus:outline-none focus:border-jci-blue/50 focus:bg-white/[0.08] focus:ring-8 focus:ring-jci-blue/5 hover:bg-white/[0.04] transition-all duration-500 shadow-inner text-lg font-bold" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="flex items-center gap-3 text-[12px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">
                  <Ticket size={14} className="text-jci-yellow" /> Identification du Billet
                </label>
                <input 
                  type="text" 
                  name="ref" 
                  placeholder="CODE DE RÉFÉRENCE" 
                  autoComplete="off"
                  className="w-full h-24 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-white placeholder-white/20 focus:outline-none focus:border-jci-yellow/50 focus:bg-white/[0.1] focus:ring-8 focus:ring-jci-yellow/5 hover:bg-white/[0.06] transition-all duration-500 shadow-inner uppercase font-mono tracking-[0.4em] text-2xl" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full h-24 md:h-28 text-2xl md:text-3xl mt-8 flex items-center justify-center gap-6 group/btn shadow-[0_20px_60px_rgba(0,151,215,0.4)] hover:shadow-[0_40px_100px_rgba(0,151,215,0.6)] active:scale-95 transition-all duration-300"
              >
                {loading ? (
                  <Loader2 className="w-10 h-10 animate-spin" />
                ) : (
                  <>
                    <span className="tracking-tighter font-black">ACTIVER MAINTENANT</span>
                    <ArrowRight size={32} className="group-hover/btn:translate-x-3 transition-transform duration-500" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      {/* Massive Spacer to ensure the footer has air */}
      <div className="h-[20vh] md:h-[30vh] w-full" aria-hidden />

      <SceneFooter />
    </div>
  );
}
