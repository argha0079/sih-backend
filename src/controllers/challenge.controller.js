import { ChallengeService } from "../services/challenge.service.js";

const challengeService = new ChallengeService();

const VALID_DOMAINS = [
    "disaster_management", "agriculture", "health", "education",
    "water_sanitation", "infrastructure", "environment", "mining",
    "tribal_welfare", "employment", "urban_development", "other"
];

export const createChallenge = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { title, description, location } = req.body;
        const files = req.files;

        if (!title) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "Title is required"
            });
        }

        const challenge = await challengeService.submitChallenge(
            userId,
            { title, description, location },
            files
        );

        res.status(201).json({
            success: true,
            data: challenge,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const getMyChallenges = async (req, res, next) => {
    try {
        const challenges = await challengeService.getMyChallenges(req.userId);

        res.status(200).json({
            success: true,
            data: challenges,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const getChallengeById = async (req, res, next) => {
    try {
        const challenge = await challengeService.getChallengeById(req.params.id);

        if (!challenge) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "Challenge not found"
            });
        }

        res.status(200).json({
            success: true,
            data: challenge,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const listChallenges = async (req, res, next) => {
    try {
        const filters = {
            status: req.query.status,
            domain: req.query.domain,
            submitted_by_clerk_id: req.query.submitted_by_clerk_id,
            assigned_to_university_id: req.query.assigned_to_university_id,
            title: req.query.title,
            location: req.query.location
        };

        const challenges = await challengeService.listChallenges(filters);

        res.status(200).json({
            success: true,
            data: challenges,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const overrideCategory = async (req, res, next) => {
    try {
        const { domain } = req.body;

        if (!domain || !VALID_DOMAINS.includes(domain)) {
            return res.status(400).json({
                success: false,
                data: null,
                error: `Invalid domain. Must be one of: ${VALID_DOMAINS.join(", ")}`
            });
        }

        const challenge = await challengeService.overrideCategory(req.params.id, domain);

        res.status(200).json({
            success: true,
            data: challenge,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const assignChallenge = async (req, res, next) => {
    try {
        const { universityId } = req.body;

        if (!universityId) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "universityId is required"
            });
        }

        const challenge = await challengeService.assignChallenge(req.params.id, universityId);

        res.status(200).json({
            success: true,
            data: challenge,
            error: null
        });
    } catch (err) {
        next(err);
    }
};
