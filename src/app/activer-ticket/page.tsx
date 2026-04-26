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
          <div className="glass-card w-full p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              {message && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mb-8 p-4 rounded-xl text-center font-bold text-sm ${
                    message.type === 'success' 
                      ? 'bg-jci-teal/20 text-jci-teal outline outline-1 outline-jci-teal/30' 
                      : 'bg-red-500/20 text-red-300 outline outline-1 outline-red-500/30'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="flex flex-col gap-8">
              {/* Name field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest px-1">
                  Nom & Prénom
                </label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Ex: Mohamed Amine" 
                  className="w-full h-16 bg-black/40 border border-white/10 rounded-2xl px-6 text-white text-lg focus:outline-none focus:border-jci-blue transition-all" 
                  required 
                />
              </div>

              {/* Phone field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest px-1">
                  Numéro Téléphone
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Ex: 55 123 456" 
                  className="w-full h-16 bg-black/40 border border-white/10 rounded-2xl px-6 text-white text-lg focus:outline-none focus:border-jci-blue transition-all" 
                  required 
                />
              </div>

              {/* Reference field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest px-1 text-jci-yellow">
                  Référence du Billet
                </label>
                <input 
                  type="text" 
                  name="ref" 
                  placeholder="Ex: TKW-001" 
                  className="w-full h-16 bg-black/40 border border-white/10 rounded-2xl px-6 text-white text-lg focus:outline-none focus:border-jci-yellow transition-all uppercase font-mono tracking-widest" 
                  required 
                />
              </div>

              {/* Submit button */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full h-16 text-xl mt-4 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="font-extrabold tracking-tight">ACTIVER MON BILLET</span>
                    <ArrowRight size={22} />
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
