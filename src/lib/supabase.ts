import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://bctvgrlkkdznmihucypp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdHZncmxra2R6bm1paHVjeXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjcxNTUsImV4cCI6MjEwMzYwMzE1NX0.rolCQie-6lrdfMZaLZuIHhmpTry1LPZ4BRIcgu3lplA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
