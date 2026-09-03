import { PartnershipService } from "../services/partnership.service.js";

const partnershipService = new PartnershipService();

const VALID_TYPES = ["funding", "mentoring", "csr"];
const VALID_STATUSES = ["proposed", "approved", "active", "completed", "rejected"];

export const listOpenChallenges = async (req, res, next) => {
    try {
        const challenges = await partnershipService.listOpenChallenges();

        res.status(200).json({
            success: true,
            data: challenges,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const createPartnership = async (req, res, next) => {
    try {
        const industryId = req.userId;
        const { challengeId, partnershipType, fundingAmount } = req.body;

        if (!challengeId || !partnershipType) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "challengeId and partnershipType are required"
            });
        }

        if (!VALID_TYPES.includes(partnershipType)) {
            return res.status(400).json({
                success: false,
                data: null,
                error: `Invalid partnershipType. Must be one of: ${VALID_TYPES.join(", ")}`
            });
        }

        const partnership = await partnershipService.submitPartnership(industryId, {
            challengeId,
            partnershipType,
            fundingAmount
        });

        res.status(201).json({
            success: true,
            data: partnership,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const listMyPartnerships = async (req, res, next) => {
    try {
        const partnerships = await partnershipService.listMyPartnerships(req.userId);

        res.status(200).json({
            success: true,
            data: partnerships,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                data: null,
                error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`
            });
        }

        const partnership = await partnershipService.updateStatus(req.params.id, status);

        res.status(200).json({
            success: true,
            data: partnership,
            error: null
        });
    } catch (err) {
        next(err);
    }
};
