import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// DEBUG: confirm Vite is loading your .env
console.log("Supabase URL →", supabaseUrl);
console.log("Anon key prefix →", supabaseAnonKey?.slice(0, 8));

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
