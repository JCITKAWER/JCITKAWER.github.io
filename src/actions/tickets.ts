'use server';

import { supabase } from '@/lib/supabase';

// 1. Assign Name to Reference (Formulaire)
export async function assignTicket(reference: string, name: string, phone: string) {
  try {
    const formattedRef = reference.toUpperCase().trim();
    
    // Check if ticket already exists
    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('reference', formattedRef)
      .single();

    if (existingTicket) {
      return { success: false, message: 'Ce billet (Ref) a déjà été activé par quelqu\'un d\'autre !' };
    }

    // Insert new ticket
    const { error: insertError } = await supabase
      .from('tickets')
      .insert([
        { reference: formattedRef, name, phone, status: 'VALID' }
      ]);

    if (insertError) {
      console.error(insertError);
      return { success: false, message: 'Erreur lors de l\'enregistrement de votre billet.' };
    }

    return { success: true, message: 'Billet activé avec succès !' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Une erreur inattendue est survenue.' };
  }
}

// 2. Scan and Verify Entry
export async function verifyAndScanTicket(reference: string) {
  try {
    const formattedRef = reference.toUpperCase().trim();

    // Look up ticket
    const { data: ticket } = await supabase
      .from('tickets')
      .select('*')
      .eq('reference', formattedRef)
      .single();

    if (!ticket) {
      return { success: false, status: 'invalid', message: 'BILLET INVALIDE (Billet non trouvé ou non activé).' };
    }

    if (ticket.status === 'USED') {
      return { success: false, status: 'invalid', message: 'BILLET DÉJÀ SCANNÉ ! Attention à la fraude.', name: ticket.name };
    }

    // Mark as USED
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'USED' })
      .eq('reference', formattedRef);

    if (updateError) {
      return { success: false, status: 'invalid', message: 'Erreur lors de la validation du billet.' };
    }

    return { success: true, status: 'valid', name: ticket.name, message: 'ACCÈS AUTORISÉ' };
  } catch (err) {
    console.error(err);
    return { success: false, status: 'error', message: 'Erreur de connexion avec le capteur.' };
  }
}
