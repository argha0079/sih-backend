import { config } from "dotenv";

config();

export const {
    PORT,
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
    CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY,
    RESEND_API_KEY
} = process.env;