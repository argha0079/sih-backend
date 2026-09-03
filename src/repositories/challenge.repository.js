import { supabase } from "../utils/supabaseClient.js";

export class ChallengeRepository {
    
    async createChallenge({
        title,
        description,
        location,
        submitted_by_clerk_id
    }) {
        const { data, error } = await supabase
            .from("challenges")
            .insert({
                title,
                description,
                location,
                submitted_by_clerk_id
            })
            .select()
            .single();

        if (error) throw error;

        return data;
    }


    async findChallengeById(id) {
        const { data, error } = await supabase
            .from("challenges")
            .select(`
                *,
                challenge_media(*)
            `)
            .eq("id", id)
            .single();

        if (error) throw error;

        return data;
    }


    async findChallengesByUser(clerkId) {
        const { data, error } = await supabase
            .from("challenges")
            .select(`
                *,
                challenge_media(*)
            `)
            .eq("submitted_by_clerk_id", clerkId)
            .order("created_at", {
                ascending: false
            });

        if (error) throw error;

        return data;
    }


    async updateChallengeDomain(id, domain) {
        const { data, error } = await supabase
            .from("challenges")
            .update({
                domain
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    }


    async updateChallengeStatus(id, status) {
        const { data, error } = await supabase
            .from("challenges")
            .update({
                status
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    }


    async assignChallenge(id, universityId) {
        const { data, error } = await supabase
            .from("challenges")
            .update({
                assigned_to_university_id: universityId,
                status: "assigned"
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    }


    async findChallenges(filters = {}) {
        let query = supabase
            .from("challenges")
            .select("*");

        // Exact-match filters
        if (filters.status) {
            query = query.eq("status", filters.status);
        }

        if (filters.domain) {
            query = query.eq("domain", filters.domain);
        }

        if (filters.submitted_by_clerk_id) {
            query = query.eq(
                "submitted_by_clerk_id",
                filters.submitted_by_clerk_id
            );
        }

        if (filters.assigned_to_university_id) {
            query = query.eq(
                "assigned_to_university_id",
                filters.assigned_to_university_id
            );
        }

        // Search filters
        if (filters.title) {
            query = query.ilike(
                "title",
                `%${filters.title}%`
            );
        }

        if (filters.location) {
            query = query.ilike(
                "location",
                `%${filters.location}%`
            );
        }

        const { data, error } = await query
            .order("created_at", {
                ascending: false
            });

        if (error) throw error;

        return data;
    }


    async updateChallengeCategory(id, domain) {
        const { data, error } = await supabase
            .from("challenges")
            .update({
                domain
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    }


    async createMediaRecord({ challenge_id, file_url, file_type }) {
        const { data, error } = await supabase
            .from("challenge_media")
            .insert({ challenge_id, file_url, file_type })
            .select()
            .single();

        if (error) throw error;

        return data;
    }


    async markAsDuplicate(id) {
        const { error } = await supabase
            .from("challenges")
            .update({ is_duplicate: true })
            .eq("id", id);

        if (error) throw error;
    }
}
