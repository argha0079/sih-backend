import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import {
    listOpenChallenges,
    createPartnership,
    listMyPartnerships,
    updateStatus
} from "../../controllers/partnership.controller.js";

const router = Router();

router.get("/open", requireAuth, requireRole("industry"), listOpenChallenges);
router.post("/", requireAuth, requireRole("industry"), createPartnership);
router.get("/mine", requireAuth, requireRole("industry"), listMyPartnerships);
router.patch("/:id/status", requireAuth, requireRole("admin"), updateStatus);

export default router;
