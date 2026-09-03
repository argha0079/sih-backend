import { AnalyticsRepository } from "../repositories/analytics.repository.js";

export class AnalyticsService {

    constructor() {
        this.analyticsRepository = new AnalyticsRepository();
    }

    async getOverview() {
        return await this.analyticsRepository.getOverview();
    }

    async getDomainBreakdown() {
        return await this.analyticsRepository.getDomainBreakdown();
    }

    async getRecentChallenges() {
        return await this.analyticsRepository.getRecentChallenges();
    }
}
