import { PartnershipRepository } from "../repositories/partnership.repository.js";
import { NotificationService } from "./notification.service.js";

export class PartnershipService {

    constructor() {
        this.partnershipRepository = new PartnershipRepository();
        this.notificationService = new NotificationService();
    }

    async submitPartnership(industryId, { challengeId, partnershipType, fundingAmount }) {
        const partnership = await this.partnershipRepository.createPartnership({
            challenge_id: challengeId,
            industry_id: industryId,
            partnership_type: partnershipType,
            funding_amount: fundingAmount
        });

        return partnership;
    }

    async listMyPartnerships(industryId) {
        return await this.partnershipRepository.findPartnershipsByIndustry(industryId);
    }

    async updateStatus(id, status) {
        const partnership = await this.partnershipRepository.updatePartnershipStatus(id, status);

        if (status === "approved") {
            this.notificationService.notify(
                partnership.industry_id,
                "Your partnership offer has been approved.",
                "Partnership Approved"
            ).catch(() => {});
        }

        return partnership;
    }

    async listOpenChallenges() {
        return await this.partnershipRepository.findOpenChallenges();
    }
}
