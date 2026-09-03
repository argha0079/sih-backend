import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import {
    createProject,
    listProjects,
    getProject
} from "../../controllers/project.controller.js";

const router = Router();

router.post("/", requireAuth, requireRole("university"), createProject);
router.get("/", requireAuth, requireRole("university"), listProjects);
router.get("/:id", requireAuth, getProject);

export default router;
