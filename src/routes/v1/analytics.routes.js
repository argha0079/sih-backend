import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import {
    getOverview,
    getDomainBreakdown,
    getRecentChallenges
} from "../../controllers/analytics.controller.js";

const router = Router();

router.get("/overview", requireAuth, requireRole("admin"), getOverview);
router.get("/domains", requireAuth, requireRole("admin"), getDomainBreakdown);
router.get("/recent", requireAuth, requireRole("admin"), getRecentChallenges);

export default router;
