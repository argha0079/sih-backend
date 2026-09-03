import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import {
    addMilestone,
    completeMilestone,
    listMilestones
} from "../../controllers/milestone.controller.js";

const router = Router();

router.post("/", requireAuth, requireRole("university"), addMilestone);
router.patch("/:id/complete", requireAuth, requireRole("university"), completeMilestone);
router.get("/project/:projectId", requireAuth, listMilestones);

export default router;
