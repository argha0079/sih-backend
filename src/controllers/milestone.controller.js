import { MilestoneService } from "../services/milestone.service.js";

const milestoneService = new MilestoneService();

export const addMilestone = async (req, res, next) => {
    try {
        const universityId = req.userId;
        const { projectId, title, dueDate } = req.body;

        if (!projectId || !title) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "projectId and title are required"
            });
        }

        const milestone = await milestoneService.addMilestone(universityId, {
            projectId,
            title,
            dueDate
        });

        res.status(201).json({
            success: true,
            data: milestone,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const completeMilestone = async (req, res, next) => {
    try {
        const universityId = req.userId;
        const milestone = await milestoneService.markComplete(req.params.id, universityId);

        res.status(200).json({
            success: true,
            data: milestone,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const listMilestones = async (req, res, next) => {
    try {
        const milestones = await milestoneService.listMilestones(req.params.projectId);

        res.status(200).json({
            success: true,
            data: milestones,
            error: null
        });
    } catch (err) {
        next(err);
    }
};
