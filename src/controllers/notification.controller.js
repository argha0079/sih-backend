import { NotificationService } from "../services/notification.service.js";

const notificationService = new NotificationService();

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getMyNotifications(req.userId);

        res.status(200).json({
            success: true,
            data: notifications,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const markRead = async (req, res, next) => {
    try {
        const notification = await notificationService.markRead(req.params.id, req.userId);

        res.status(200).json({
            success: true,
            data: notification,
            error: null
        });
    } catch (err) {
        next(err);
    }
};

export const markAllRead = async (req, res, next) => {
    try {
        await notificationService.markAllRead(req.userId);

        res.status(200).json({
            success: true,
            data: { message: "All notifications marked as read" },
            error: null
        });
    } catch (err) {
        next(err);
    }
};
