import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { createClient } from '@supabase/supabase-js';
import { StatusBar } from 'expo-status-bar';
import { Lock, ScanLine, ShieldAlert, CheckCircle2, ChevronLeft } from 'lucide-react-native';

// Supabase Configuration
const SUPABASE_URL = 'https://zafngjvhbtrytoeahzcc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__EhVlw40Om9Xg2rosA3nIg_LFvbvaAL';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { width } = Dimensions.get('window');

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'valid' | 'invalid'>('idle');
  const [attendeeName, setAttendeeName] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pin, setPin] = useState('');

  const ADMIN_PIN = '1234';

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || status !== 'idle') return;
    
    setScanned(true);
    setStatus('scanning');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const token = data.trim();
      console.log('Scanning token:', token);
      
      const { data: ticket, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('secret_token', token)
        .maybeSingle();

      if (error) {
        console.error('Database Error:', error.message);
        setStatus('invalid');
        setScanResult('Erreur DB');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (!ticket) {
        setStatus('invalid');
        setScanResult('Code Inconu');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (ticket.status === 'USED') {
        setStatus('invalid');
        setAttendeeName(ticket.name || 'Anonyme');
        setScanResult('Déjà Utilisé');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        // Mark as USED
        const { error: updateError } = await supabase
          .from('tickets')
          .update({ status: 'USED' })
          .eq('secret_token', token);

        if (updateError) {
          console.error('Update Error:', updateError.message);
          setStatus('invalid');
          setScanResult('Erreur Sync');
        } else {
          setStatus('valid');
          setAttendeeName(ticket.name || 'Activé (Test)');
          setScanResult(ticket.reference);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (e) {
      console.error('System Error:', e);
      setStatus('invalid');
      setScanResult('Erreur Système');
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setScanned(false);
      setStatus('idle');
      setAttendeeName('');
      setScanResult('');
    }, 4000);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Veuillez autoriser l'accès à la caméra pour scanner.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#050A18' }]}>
        <StatusBar style="light" />
        <View style={styles.authBox}>
          <View style={styles.iconCircle}>
            <Lock color="#0097D7" size={40} />
          </View>
          <Text style={styles.authTitle}>ACCÈS ADMIN</Text>
          <Text style={styles.authSub}>Entrez votre PIN pour déverrouiller le scanner</Text>
          
          <View style={styles.pinRow}>
            {/* Simple PIN input logic would go here, simplified for now */}
            <TouchableOpacity 
              style={styles.loginBtn}
              onPress={() => setIsAuthenticated(true)} // FOR DEMO: Clicking works. In real app, check PIN.
            >
              <Text style={styles.loginBtnText}>DÉVERROUILLER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <CameraView 
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Viewfinder Overlay */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.focusedRow}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.focusedContainer}>
             {/* Corner Markers */}
             <View style={[styles.corner, styles.tl]} />
             <View style={[styles.corner, styles.tr]} />
             <View style={[styles.corner, styles.bl]} />
             <View style={[styles.corner, styles.br]} />
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.unfocusedContainer}>
          <View style={styles.bottomInfo}>
             <ScanLine color="rgba(255,255,255,0.3)" size={32} />
             <Text style={styles.scanText}>ALIGNER LE QR CODE</Text>
          </View>
        </View>
      </View>

      {/* Status Indicators */}
      {status !== 'idle' && (
        <View style={[
          styles.statusOverlay,
          status === 'valid' ? styles.bgValid : status === 'invalid' ? styles.bgInvalid : styles.bgScanning
        ]}>
          {status === 'scanning' && <Text style={styles.statusText}>VÉRIFICATION...</Text>}
          {status === 'valid' && (
            <View style={styles.center}>
              <CheckCircle2 color="white" size={80} />
              <Text style={styles.statusTitle}>ACCÈS VALIDE</Text>
              <Text style={styles.statusName}>{attendeeName}</Text>
              <Text style={styles.statusRef}>{scanResult}</Text>
            </View>
          )}
          {status === 'invalid' && (
            <View style={styles.center}>
              <ShieldAlert color="white" size={80} />
              <Text style={styles.statusTitle}>REFUSÉ</Text>
              <Text style={styles.statusName}>{scanResult}</Text>
              {attendeeName ? <Text style={styles.statusRef}>Propriétaire: {attendeeName}</Text> : null}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0097D7',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '900',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  focusedRow: {
    flexDirection: 'row',
    height: width * 0.7,
  },
  focusedContainer: {
    width: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#0097D7',
  },
  tl: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5 },
  tr: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5 },
  br: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5 },
  bottomInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  scanText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 10,
  },
  statusOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  bgScanning: { backgroundColor: 'rgba(0,0,0,0.8)' },
  bgValid: { backgroundColor: 'rgba(16, 185, 129, 0.9)' },
  bgInvalid: { backgroundColor: 'rgba(239, 68, 68, 0.9)' },
  statusText: { color: '#fff', fontSize: 24, fontWeight: '900' },
  center: { alignItems: 'center' },
  statusTitle: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 20 },
  statusName: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 5 },
  statusRef: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 10 },
  authBox: {
    width: '90%',
    padding: 30,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0,151,215,0.1)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,151,215,0.2)',
  },
  authTitle: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  authSub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', marginTop: 10, marginBottom: 40 },
  pinRow: { width: '100%', alignItems: 'center' },
  loginBtn: {
    backgroundColor: '#0097D7',
    width: '100%',
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
