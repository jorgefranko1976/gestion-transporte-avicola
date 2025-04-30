
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuración para base de datos PostgreSQL local
// Estos valores deben ajustarse según la configuración de su PostgreSQL local
const SUPABASE_URL = "http://localhost:54321";  // Puerto por defecto de Supabase CLI
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// Comentamos la configuración original de Supabase
// const SUPABASE_URL = "https://shuwjedbpimcfzjftylf.supabase.co";
// const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNodXdqZWRicGltY2Z6amZ0eWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDU0NzksImV4cCI6MjA1ODQyMTQ3OX0.4sZOXmvOdtWpbfrcWZzMPVjN17tsBuy_p38Qlv454Gg";

// Para usar con PostgreSQL local necesitamos crear un nuevo archivo en:
// /supabase/config.toml con los datos de conexión

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Para ayudar a diagnosticar la conexión
console.log("Intentando conectar a PostgreSQL local en:", SUPABASE_URL);
