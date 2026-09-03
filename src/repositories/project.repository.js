import { supabase } from "../utils/supabaseClient.js";

export class ProjectRepository {

    async createProject({ challenge_id, university_id, faculty_mentor }) {
        const { data, error } = await supabase
            .from("university_projects")
            .insert({ challenge_id, university_id, faculty_mentor })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async findProjectsByUniversity(universityId) {
        const { data, error } = await supabase
            .from("university_projects")
            .select("*, challenges(title, domain, status)")
            .eq("university_id", universityId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async findProjectById(id) {
        const { data, error } = await supabase
            .from("university_projects")
            .select("*, team_members(*), challenges(title, domain, status)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async findProjectByChallengeId(challengeId) {
        const { data, error } = await supabase
            .from("university_projects")
            .select("*")
            .eq("challenge_id", challengeId)
            .single();

        if (error) throw error;
        return data;
    }

    async insertTeamMembers(members) {
        const { data, error } = await supabase
            .from("team_members")
            .insert(members)
            .select();

        if (error) throw error;
        return data;
    }
}
