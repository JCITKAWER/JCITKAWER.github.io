'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ScannerPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid' | 'scanning'>('idle');
  const [attendeeName, setAttendeeName] = useState<string>('');
  
  const ADMIN_PIN = '1234'; // Change this to your preferred PIN!

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
    } else {
      alert('PIN Incorrect !');
      setPin('');
    }
  };

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    // Only run on client
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    scannerRef.current = html5QrcodeScanner;
    
    const onScanSuccess = async (decodedText: string) => {
      // Prevent multiple rapid scans using the latest ref
      const currentStatus = statusRef.current;
      if (currentStatus === 'scanning' || currentStatus === 'valid' || currentStatus === 'invalid') return;
      
      setScanResult(decodedText);
      setStatus('scanning');

      try {
        const token = decodedText.trim();
        console.log(`Verifying secure token: ${token}`);
        
        // 1. Fetch ticket by secret token
        const { data: ticket, error: fetchError } = await supabase
          .from('tickets')
          .select('*')
          .eq('secret_token', token)
          .maybeSingle();

        if (fetchError || !ticket) {
          setStatus('invalid');
          setScanResult('BILLET INVALIDE (Token non reconnu)');
        } else if (!ticket.name) {
          setStatus('invalid');
          setScanResult('ERREUR: Billet non activé par le client.');
        } else if (ticket.status === 'USED') {
          setStatus('invalid');
          setAttendeeName(ticket.name);
          setScanResult('DÉJÀ SCANNÉ ! Attention fraude.');
        } else {
          // 2. Mark as Used
          const { error: updateError } = await supabase
            .from('tickets')
            .update({ status: 'USED' })
            .eq('secret_token', token);

          if (updateError) throw updateError;

          setStatus('valid');
          setAttendeeName(ticket.name);
          setScanResult(`ACCÈS AUTORISÉ (${ticket.reference})`);
        }

        // Reset after 3 seconds for the next person
        setTimeout(() => {
          setStatus('idle');
          setScanResult(null);
          setAttendeeName('');
        }, 3000);

      } catch (err) {
        console.error(err);
        setStatus('invalid');
        setScanResult('Erreur de connexion');
        setTimeout(() => setStatus('idle'), 3000);
      }
    };

    const onScanFailure = () => {
      // We ignore failures as the scanner constantly tries to find a QR code
    };

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1130] flex flex-col items-center justify-center p-4">
        <form onSubmit={handlePinSubmit} className="w-full max-w-xs bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl text-center">
          <h1 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Admin Access</h1>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN" 
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-jci-blue mb-4"
          />
          <button type="submit" className="w-full bg-jci-blue text-white font-bold py-4 rounded-xl">Unlock Scanner</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1130] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white flex flex-col overflow-hidden rounded-2xl shadow-2xl">
        <div className="bg-[#0d162b] text-white p-4 text-center pb-6">
          <h1 className="text-xl font-black mb-1">Scanner d&apos;Entrée</h1>
          <p className="text-xs text-white/60">JCI Tkawer 2.0</p>
        </div>
        
        {/* The target Div for HTML5-QRCode injection */}
        <div id="qr-reader" className="w-full bg-black min-h-[300px]"></div>

        {/* Status Overlay */}
        <div className={`p-6 text-center transition-colors duration-300 ${status === 'valid' ? 'bg-green-500' : status === 'invalid' ? 'bg-red-500' : 'bg-gray-100'}`}>
          {status === 'idle' && (
            <p className="text-gray-500 font-medium">En attente de scan...</p>
          )}
          {status === 'scanning' && (
            <p className="text-gray-800 font-bold animate-pulse">Vérification en cours...</p>
          )}
          {status === 'valid' && (
            <div className="flex flex-col items-center text-white">
              <CheckCircle size={48} className="mb-2" />
              <h2 className="text-2xl font-black">ACCÈS AUTORISÉ</h2>
              <p className="text-white/90 text-lg mt-1 font-medium">{attendeeName}</p>
              <p className="text-white/70 text-sm">{scanResult}</p>
            </div>
          )}
          {status === 'invalid' && (
            <div className="flex flex-col items-center text-white">
              <XCircle size={48} className="mb-2" />
              <h2 className="text-2xl font-black">BILLET INVALIDE</h2>
              <p className="text-white/90 text-sm mt-1">Ce billet est introuvable ou déjà scanné !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
