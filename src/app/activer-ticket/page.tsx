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

      <main className="container-pro relative z-10 py-20 min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-xl"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10">
            <span className="badge mb-4">Accès Officiel</span>
            <h1 className="text-4xl md:text-6xl font-black text-center leading-tight tracking-tight mb-4 uppercase">
              <GradientText variant="jci" as="span" className="block">ACTIVER</GradientText>
              <GradientText variant="gold" as="span" className="block">BILLET</GradientText>
            </h1>
            <p className="text-white/40 text-center text-sm md:text-base max-w-sm leading-relaxed">
              Associez votre billet physique à votre identité pour l'entrée.
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-jci-blue/30 to-transparent" />
            
            <AnimatePresence mode="wait">
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-8 p-5 rounded-xl flex items-start gap-4 ${
                    message.type === 'success' 
                      ? 'bg-jci-teal/10 text-jci-teal border border-jci-teal/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                  <p className="text-sm font-medium">{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                  Nom & Prénom
                </label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Ex: Mohamed Amine" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/20 focus:outline-none focus:border-jci-blue/50 transition-all font-medium" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                  Téléphone
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Ex: 55 123 456" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/20 focus:outline-none focus:border-jci-blue/50 transition-all font-medium" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                  Référence du Billet
                </label>
                <input 
                  type="text" 
                  name="ref" 
                  placeholder="Ex: TKW-001" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/20 focus:outline-none focus:border-jci-yellow/50 transition-all uppercase font-mono tracking-widest" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full h-16 text-lg mt-4 flex items-center justify-center gap-3 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="font-bold">ACTIVER MAINTENANT</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
