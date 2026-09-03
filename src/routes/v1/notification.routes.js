import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
    getNotifications,
    markRead,
    markAllRead
} from "../../controllers/notification.controller.js";

const router = Router();

router.get("/", requireAuth, getNotifications);
router.patch("/:id/read", requireAuth, markRead);
router.patch("/read-all", requireAuth, markAllRead);

export default router;
