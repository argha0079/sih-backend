import { NotificationRepository } from "../repositories/notification.repository.js";
import { sendEmail } from "../utils/resend.js";

export class NotificationService {

    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    async notify(clerkId, message, emailSubject) {
        const notification = await this.notificationRepository.createNotification(clerkId, message);

        if (emailSubject) {
            sendEmail(
                clerkId,
                emailSubject,
                `<p>${message}</p>`
            ).catch(() => {});
        }

        return notification;
    }

    async getMyNotifications(clerkId) {
        return await this.notificationRepository.findNotificationsByUser(clerkId);
    }

    async markRead(id, clerkId) {
        const all = await this.notificationRepository.findNotificationsByUser(clerkId);
        const owned = all.some((n) => n.id === id);
        if (!owned) {
            throw Object.assign(new Error("Notification not found"), { statusCode: 404 });
        }

        return await this.notificationRepository.markRead(id);
    }

    async markAllRead(clerkId) {
        return await this.notificationRepository.markAllRead(clerkId);
    }
}
