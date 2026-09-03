import { ProjectRepository } from "../repositories/project.repository.js";
import { sendEmail } from "../utils/resend.js";

export class ProjectService {

    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    async createProject(universityId, { challengeId, facultyMentor, teamMembers }) {
        const project = await this.projectRepository.createProject({
            challenge_id: challengeId,
            university_id: universityId,
            faculty_mentor: facultyMentor
        });

        if (teamMembers && teamMembers.length > 0) {
            const members = teamMembers.map((m) => ({
                project_id: project.id,
                name: m.name,
                email: m.email || null,
                roll_number: m.roll_number || null
            }));

            await this.projectRepository.insertTeamMembers(members);
        }

        return await this.projectRepository.findProjectById(project.id);
    }

    async listMyProjects(universityId) {
        return await this.projectRepository.findProjectsByUniversity(universityId);
    }

    async getProject(id) {
        return await this.projectRepository.findProjectById(id);
    }
}
