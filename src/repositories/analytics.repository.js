import { supabase } from "../utils/supabaseClient.js";

export class AnalyticsRepository {

    async getOverview() {
        const [challengesCount, projectsCount, fundingSum, partnershipsCount] = await Promise.all([
            supabase.from("challenges").select("id", { count: "exact", head: true }),
            supabase.from("university_projects").select("id", { count: "exact", head: true }),
            supabase.from("industry_partnerships").select("funding_amount").eq("status", "approved"),
            supabase.from("industry_partnerships").select("id", { count: "exact", head: true }).eq("status", "active")
        ]);

        const byStatus = {};
        const statuses = ["submitted", "under_review", "assigned", "in_progress", "resolved"];
        for (const status of statuses) {
            const { count } = await supabase
                .from("challenges")
                .select("id", { count: "exact", head: true })
                .eq("status", status);
            byStatus[status] = count || 0;
        }

        const totalFunding = fundingSum.data?.reduce((sum, p) => sum + (Number(p.funding_amount) || 0), 0) || 0;

        return {
            total_challenges: challengesCount.count || 0,
            by_status: byStatus,
            total_projects: projectsCount.count || 0,
            total_funding: totalFunding,
            active_partnerships: partnershipsCount.count || 0
        };
    }

    async getDomainBreakdown() {
        const { data, error } = await supabase
            .from("challenges")
            .select("domain");

        if (error) throw error;

        const breakdown = {};
        for (const row of data) {
            const domain = row.domain || "uncategorized";
            breakdown[domain] = (breakdown[domain] || 0) + 1;
        }

        return Object.entries(breakdown).map(([domain, count]) => ({ domain, count }));
    }

    async getRecentChallenges() {
        const { data, error } = await supabase
            .from("challenges")
            .select("id, title, domain, status, location, created_at")
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) throw error;
        return data;
    }
}
