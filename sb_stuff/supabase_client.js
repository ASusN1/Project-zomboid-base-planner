// stuff : https://supabase.com/docs/reference/javascript/installing - incase forgor
// pull the createcleitn function from supabase hosted library 
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = ""; 

window.sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase client initialized:", window.sb);