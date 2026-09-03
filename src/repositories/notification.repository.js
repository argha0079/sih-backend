import { supabase } from "../utils/supabaseClient.js";

export class NotificationRepository {

    async createNotification(clerk_user_id, message) {
        const { data, error } = await supabase
            .from("notifications")
            .insert({ clerk_user_id, message })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async findNotificationsByUser(clerkId) {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("clerk_user_id", clerkId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async markRead(id) {
        const { data, error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async markAllRead(clerkId) {
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("clerk_user_id", clerkId)
            .eq("is_read", false);

        if (error) throw error;
    }
}
