import { AnalyticsService } from "../services/analytics.service.js";

const analyticsService = new AnalyticsService();

export const getOverview = async (req, res, next) => {
    try {
        const data = await analyticsService.getOverview();

        res.status(200).json({
            success: true,
            data,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const getDomainBreakdown = async (req, res, next) => {
    try {
        const data = await analyticsService.getDomainBreakdown();

        res.status(200).json({
            success: true,
            data,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const getRecentChallenges = async (req, res, next) => {
    try {
        const data = await analyticsService.getRecentChallenges();

        res.status(200).json({
            success: true,
            data,
            error: null
        });
    } catch (err) {
        next(err);
    }
};
