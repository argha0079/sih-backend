import { ChallengeRepository } from "../repositories/challenge.repository.js";
import { uploadChallengeMedia } from "../utils/storage.js";
import { callCategorize, callDeduplicate } from "../utils/mlClient.js";
import { NotificationService } from "./notification.service.js";

export class ChallengeService {

    constructor() {
        this.challengeRepository = new ChallengeRepository();
        this.notificationService = new NotificationService();
    }

    async submitChallenge(userId, { title, description, location }, files) {
        // 1. Insert challenge
        const challenge = await this.challengeRepository.createChallenge({
            title,
            description,
            location,
            submitted_by_clerk_id: userId
        });

        // 2 & 3. Upload files and create media records
        const mediaRecords = [];

        if (files && files.length > 0) {
            for (const file of files) {
                const mediaUrl = await uploadChallengeMedia(file, challenge.id);

                const determineFileType = (mimetype) => {
                    if (mimetype.startsWith("image/")) return "image";
                    if (mimetype.startsWith("video/")) return "video";
                    return "document";
                };

                const record = await this.challengeRepository.createMediaRecord({
                    challenge_id: challenge.id,
                    file_url: mediaUrl,
                    file_type: determineFileType(file.mimetype)
                });

                mediaRecords.push(record);
            }
        }

        // 4. Categorize challenge
        const categorization = await callCategorize(title, description);

        // 5. Update domain
        if (categorization?.category) {
            await this.challengeRepository.updateChallengeDomain(
                challenge.id,
                categorization.category
            );
        }

        // 6. Check for duplicates
        const deduplication = await callDeduplicate(challenge.id, title, description);

        // 7. Mark duplicate if required
        if (deduplication?.is_duplicate) {
            await this.challengeRepository.markAsDuplicate(challenge.id);
        }

        // 8. Notify citizen (non-blocking)
        this.notificationService.notify(
            userId,
            'Your challenge "' + title + '" has been received and is under review.',
            "Challenge Received"
        ).catch(() => {});

        // 9. Return challenge with media
        return {
            ...challenge,
            domain: categorization?.category || null,
            media: mediaRecords
        };
    }

    async getMyChallenges(userId) {
        return await this.challengeRepository.findChallengesByUser(userId);
    }

    async getChallengeById(id) {
        return await this.challengeRepository.findChallengeById(id);
    }

    async listChallenges(filters) {
        return await this.challengeRepository.findChallenges(filters);
    }

    async overrideCategory(id, domain) {
        return await this.challengeRepository.updateChallengeDomain(id, domain);
    }

    async assignChallenge(id, universityId) {
        const challenge = await this.challengeRepository.assignChallenge(id, universityId);

        // Notify university (non-blocking)
        this.notificationService.notify(
            universityId,
            'A new challenge "' + challenge.title + '" has been assigned to your institution.',
            "New Challenge Assigned"
        ).catch(() => {});

        // Notify citizen (non-blocking)
        if (challenge.submitted_by_clerk_id) {
            this.notificationService.notify(
                challenge.submitted_by_clerk_id,
                'Your challenge "' + challenge.title + '" has been assigned to a university and is now being worked on.',
                "Challenge Assigned"
            ).catch(() => {});
        }

        return challenge;
    }
}
