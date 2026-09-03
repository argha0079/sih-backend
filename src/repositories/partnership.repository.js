import { supabase } from "../utils/supabaseClient.js";

export class PartnershipRepository {

    async createPartnership({ challenge_id, industry_id, partnership_type, funding_amount }) {
        const { data, error } = await supabase
            .from("industry_partnerships")
            .insert({ challenge_id, industry_id, partnership_type, funding_amount })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async findPartnershipsByIndustry(industryId) {
        const { data, error } = await supabase
            .from("industry_partnerships")
            .select("*, challenges(title, domain, status)")
            .eq("industry_id", industryId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async updatePartnershipStatus(id, status) {
        const { data, error } = await supabase
            .from("industry_partnerships")
            .update({ status })
            .eq("id", id)
            .select("*, challenges(title, domain)")
            .single();

        if (error) throw error;
        return data;
    }

    async findOpenChallenges() {
        const { data, error } = await supabase
            .from("challenges")
            .select("id, title, description, domain, location, status, created_at")
            .in("status", ["assigned", "in_progress"])
            .eq("is_duplicate", false)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }
}
