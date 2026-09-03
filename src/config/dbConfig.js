import { supabase } from "../utils/supabaseClient.js";

export const connectDatabase = async () => {
    try {
        const { error } = await supabase
            .from("users_metadata")
            .select("clerk_user_id")
            .limit(1);

        if (error) throw error;

        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
};
