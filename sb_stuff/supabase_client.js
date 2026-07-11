// stuff : https://supabase.com/docs/reference/javascript/installing - incase forgor
// pull the createcleitn function from supabase hosted library 
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://fnsaseeilkbxwetczteo.supabase.co';
const SUPABASE_ANON_KEY = "sb_publishable_N89aipq75mX6Ak6C6awIzg_EnunANRO"; 

window.sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase client initialized:", window.sb);