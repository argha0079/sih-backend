import { MilestoneRepository } from "../repositories/milestone.repository.js";
import { ProjectRepository } from "../repositories/project.repository.js";
import { supabase } from "../utils/supabaseClient.js";
import { NotificationService } from "./notification.service.js";

export class MilestoneService {

    constructor() {
        this.milestoneRepository = new MilestoneRepository();
        this.projectRepository = new ProjectRepository();
        this.notificationService = new NotificationService();
    }

    async addMilestone(universityId, { projectId, title, dueDate }) {
        const project = await this.projectRepository.findProjectById(projectId);

        if (!project) {
            throw Object.assign(new Error("Project not found"), { statusCode: 404 });
        }

        if (project.university_id !== universityId) {
            throw Object.assign(new Error("You can only add milestones to your own projects"), { statusCode: 403 });
        }

        return await this.milestoneRepository.createMilestone({
            project_id: projectId,
            title,
            due_date: dueDate
        });
    }

    async markComplete(milestoneId, universityId) {
        const milestone = await this.milestoneRepository.completeMilestone(milestoneId);

        const incompleteCount = await this.milestoneRepository.countIncomplete(milestone.project_id);

        if (incompleteCount === 0) {
            await supabase
                .from("university_projects")
                .update({ status: "completed" })
                .eq("id", milestone.project_id);
        }

        this.notificationService.notify(
            universityId,
            'Milestone "' + milestone.title + '" completed.',
            "Milestone Completed"
        ).catch(() => {});

        return milestone;
    }

    async listMilestones(projectId) {
        return await this.milestoneRepository.findMilestonesByProject(projectId);
    }
}
