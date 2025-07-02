import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bmkoiaglbvkxszbipzul.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta29pYWdsYnZreHN6YmlwenVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzgyMTEsImV4cCI6MjA2Mjg1NDIxMX0.Ym_fyEFWZYRKmFL0fWkc4uNxwyF3oiXESARQvZ9B2WM";

// For server-side use, we need the service role key for full access
// For now, use anon key but this limits database operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized for backend');