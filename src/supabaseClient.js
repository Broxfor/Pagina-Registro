// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpjoauoxbpegpefxhcox.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwam9hdW94YnBlZ3BlZnhoY294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjY2MjgsImV4cCI6MjA1NDgwMjYyOH0.xDts86ts7TZ0NP5RGUXrKTyBpaEtEbvJki9cOy2elCo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
