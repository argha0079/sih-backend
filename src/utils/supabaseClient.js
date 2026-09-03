import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from "../config/envConfig.js";

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_SERVICE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);