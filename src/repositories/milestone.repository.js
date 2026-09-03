import { supabase } from "../utils/supabaseClient.js";

export class MilestoneRepository {

    async createMilestone({ project_id, title, due_date }) {
        const { data, error } = await supabase
            .from("project_milestones")
            .insert({ project_id, title, due_date })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async findMilestonesByProject(projectId) {
        const { data, error } = await supabase
            .from("project_milestones")
            .select("*")
            .eq("project_id", projectId)
            .order("due_date", { ascending: true });

        if (error) throw error;
        return data;
    }

    async completeMilestone(id) {
        const { data, error } = await supabase
            .from("project_milestones")
            .update({ completed: true })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async countIncomplete(projectId) {
        const { count, error } = await supabase
            .from("project_milestones")
            .select("*", { count: "exact", head: true })
            .eq("project_id", projectId)
            .eq("completed", false);

        if (error) throw error;
        return count;
    }
}
