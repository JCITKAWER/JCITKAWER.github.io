'use client';

import { useState } from 'react';
import { assignTicket } from '@/actions/tickets';

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
    const ref = formData.get('ref') as string;

    const res = await assignTicket(ref, name, phone);
    
    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0A1130] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
        <h1 className="text-2xl font-black text-white text-center mb-2">Activer Billet</h1>
        <p className="text-white/60 text-center text-sm mb-6">Associez votre nom avec votre billet physique.</p>
        
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-center font-bold ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Nom Complet</label>
            <input type="text" name="name" placeholder="Ex: Ahmed Ben Ali" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-jci-blue" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Téléphone</label>
            <input type="tel" name="phone" placeholder="Ex: 52 781 301" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-jci-blue" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Référence du Billet (Imprimé sur le ticket)</label>
            <input type="text" name="ref" placeholder="Ex: TKW-001" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-jci-blue uppercase" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-jci-blue disabled:bg-jci-blue/50 hover:bg-jci-teal transition-colors text-white font-bold py-4 rounded-xl mt-4">
            {loading ? 'Activation en cours...' : 'Activer le Billet'}
          </button>
        </form>
      </div>
    </div>
  );
}
