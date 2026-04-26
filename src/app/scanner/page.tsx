'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, XCircle, ShieldAlert, Lock, ArrowLeft, ScanLine, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { MeshGradient, FloatingBlobs } from '@/components/immersive/effects/mesh-gradient';
import { GradientText } from '@/components/immersive/effects/gradient-text';
import Link from 'next/link';
import Image from 'next/image';

export default function ScannerPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid' | 'scanning'>('idle');
  const [attendeeName, setAttendeeName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const ADMIN_PIN = '1234'; 

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
    } else {
      setPin('');
      // Simple shake effect logic could go here
    }
  };

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const statusRef = useRef(status);
  
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 20, 
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true
      },
      false
    );
    
    scannerRef.current = html5QrcodeScanner;
    
    const onScanSuccess = async (decodedText: string) => {
      if (statusRef.current !== 'idle') return;
      
      setScanResult(decodedText);
      setStatus('scanning');

      try {
        const token = decodedText.trim();
        
        // 1. Fetch ticket by secret token
        const { data: ticket, error: fetchError } = await supabase
          .from('tickets')
          .select('*')
          .eq('secret_token', token)
          .maybeSingle();

        if (fetchError || !ticket) {
          setStatus('invalid');
        } else if (!ticket.name) {
          setStatus('invalid');
          setScanResult('Non Activé');
        } else if (ticket.status === 'USED') {
          setStatus('invalid');
          setAttendeeName(ticket.name);
          setScanResult('Déjà Scanné');
        } else {
          // 2. Mark as Used
          const { error: updateError } = await supabase
            .from('tickets')
            .update({ status: 'USED' })
            .eq('secret_token', token);

          if (updateError) throw updateError;

          setStatus('valid');
          setAttendeeName(ticket.name);
          setScanResult(ticket.reference);
        }

        setTimeout(() => {
          setStatus('idle');
          setScanResult(null);
          setAttendeeName('');
        }, 4000);

      } catch (err) {
        setStatus('invalid');
        setTimeout(() => setStatus('idle'), 4000);
      }
    };

    html5QrcodeScanner.render(onScanSuccess, () => {});

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-jci-blue/30 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <MeshGradient variant="glow" />
        <FloatingBlobs />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-jci-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-jci-blue/20">
                  <Lock className="text-jci-blue w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Sécurité Entrée</h1>
                <p className="text-white/40 text-sm font-medium">Veuillez entrer votre Code PIN Admin</p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-6">
                <input 
                  type="password" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 text-center text-4xl font-black tracking-[0.5em] focus:outline-none focus:border-jci-blue/50 focus:bg-white/[0.08] transition-all"
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="w-full h-20 bg-jci-blue text-white font-black rounded-3xl text-xl hover:bg-jci-blue/80 active:scale-95 transition-all shadow-lg shadow-jci-blue/20"
                >
                  DÉVERROUILLER
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-xl flex flex-col items-center"
            >
              {/* Header */}
              <div className="w-full flex items-center justify-between mb-8 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-jci-teal/10 rounded-xl flex items-center justify-center border border-jci-teal/20">
                    <ScanLine className="text-jci-teal w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-sm uppercase tracking-widest leading-none">Scanner Direct</h2>
                    <span className="text-[10px] text-white/30 font-bold tracking-tighter uppercase">JCI Tkawer 2.0</span>
                  </div>
                </div>
                <Link href="/" className="text-white/20 hover:text-white transition-colors">
                  <ArrowLeft size={24} />
                </Link>
              </div>

              {/* Viewfinder Wrapper */}
              <div className="relative w-full aspect-square max-w-[400px] mb-12">
                {/* Visual Frame Decorations */}
                <div className="absolute -top-4 -left-4 w-12 h-12 border-l-4 border-t-4 border-jci-blue rounded-tl-2xl z-20" />
                <div className="absolute -top-4 -right-4 w-12 h-12 border-r-4 border-t-4 border-jci-blue rounded-tr-2xl z-20" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 border-l-4 border-bottom-4 border-jci-blue rounded-bl-2xl z-20" />
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r-4 border-bottom-4 border-jci-blue rounded-br-2xl z-20" />
                
                {/* THE SCANNER DIV */}
                <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-black/40 border border-white/5 shadow-2xl backdrop-blur-3xl">
                  <div id="qr-reader" className="w-full h-full"></div>
                  
                  {/* Overlay when processing */}
                  <AnimatePresence>
                    {status !== 'idle' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 backdrop-blur-md ${
                          status === 'valid' ? 'bg-jci-teal/80' : 
                          status === 'invalid' ? 'bg-red-600/80' : 
                          'bg-black/60'
                        }`}
                      >
                        {status === 'scanning' && <Loader2 className="w-16 h-16 animate-spin text-white" />}
                        {status === 'valid' && (
                          <>
                            <CheckCircle size={80} className="text-white" />
                            <div className="text-center">
                              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">ACCÈS VALIDE</h3>
                              <p className="text-white/90 font-bold text-xl mt-2">{attendeeName}</p>
                              <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold mt-4 inline-block">{scanResult}</span>
                            </div>
                          </>
                        )}
                        {status === 'invalid' && (
                          <>
                            <ShieldAlert size={80} className="text-white" />
                            <div className="text-center">
                              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">REFUSÉ</h3>
                              <p className="text-white/90 font-bold text-lg mt-2">{scanResult || 'Code Inconnu'}</p>
                              {attendeeName && <p className="text-white/60 text-sm mt-1">Propriétaire: {attendeeName}</p>}
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Instructions */}
              <div className="text-center">
                <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
                  Aligner le QR code dans le cadre
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
