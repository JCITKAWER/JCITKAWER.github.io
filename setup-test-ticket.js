const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zafngjvhbtrytoeahzcc.supabase.co';
const supabaseAnonKey = 'sb_publishable__EhVlw40Om9Xg2rosA3nIg_LFvbvaAL';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const ref = 'TKW-TEST1';
  
  // 1. Delete if exists
  await supabase.from('tickets').delete().eq('reference', ref);
  
  // 2. Insert test ticket
  const { data, error } = await supabase.from('tickets').insert([
    { reference: ref, secret_token: require('crypto').randomUUID(), status: 'VALID' }
  ]).select();
  
  if (error) {
    console.error('Error inserting ticket:', error);
    process.exit(1);
  }
  
  console.log('Successfully created test ticket:', data);
}

main();
