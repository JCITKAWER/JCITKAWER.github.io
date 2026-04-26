'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, XCircle } from 'lucide-react';
import { verifyAndScanTicket } from '@/actions/tickets';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid' | 'scanning'>('idle');
  const [attendeeName, setAttendeeName] = useState<string>('');
  
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
        console.log(`Checking ref: ${decodedText}`);
        
        const res = await verifyAndScanTicket(decodedText);

        setStatus(res.status as 'valid' | 'invalid');
        if (res.name) setAttendeeName(res.name);
        setScanResult(res.message);

        // Reset after 3 seconds for the next person
        setTimeout(() => {
          setStatus('idle');
          setScanResult(null);
          setAttendeeName('');
        }, 3000);

      } catch (e) {
        console.error(e);
        setStatus('invalid');
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
