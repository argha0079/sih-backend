import { ProjectService } from "../services/project.service.js";

const projectService = new ProjectService();

export const createProject = async (req, res, next) => {
    try {
        const universityId = req.userId;
        const { challengeId, facultyMentor, teamMembers } = req.body;

        if (!challengeId) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "challengeId is required"
            });
        }

        const project = await projectService.createProject(universityId, {
            challengeId,
            facultyMentor,
            teamMembers
        });

        res.status(201).json({
            success: true,
            data: project,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const listProjects = async (req, res, next) => {
    try {
        const projects = await projectService.listMyProjects(req.userId);

        res.status(200).json({
            success: true,
            data: projects,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const getProject = async (req, res, next) => {
    try {
        const project = await projectService.getProject(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            data: project,
            error: null
        });
    } catch (err) {
        next(err);
    }
};
