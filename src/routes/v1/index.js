import { Router } from "express";
import challengeRouter from "./challenge.routes.js";
import projectRouter from "./project.routes.js";
import milestoneRouter from "./milestone.routes.js";
import partnershipRouter from "./partnership.routes.js";
import notificationRouter from "./notification.routes.js";
import analyticsRouter from "./analytics.routes.js";

const router = Router();

router.use("/challenges", challengeRouter);
router.use("/projects", projectRouter);
router.use("/milestones", milestoneRouter);
router.use("/partnerships", partnershipRouter);
router.use("/notifications", notificationRouter);
router.use("/analytics", analyticsRouter);

export default router;
