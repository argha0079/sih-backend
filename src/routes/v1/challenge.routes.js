import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import {
    createChallenge,
    getMyChallenges,
    getChallengeById,
    listChallenges,
    overrideCategory,
    assignChallenge
} from "../../controllers/challenge.controller.js";

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "video/mp4"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, and MP4 files are allowed"));
        }
    }
});

router.post("/", requireAuth, requireRole("citizen"), upload.array("media", 5), createChallenge);
router.get("/mine", requireAuth, requireRole("citizen"), getMyChallenges);
router.get("/", requireAuth, requireRole("admin"), listChallenges);
router.get("/:id", requireAuth, getChallengeById);
router.patch("/:id/category", requireAuth, requireRole("admin"), overrideCategory);
router.patch("/:id/assign", requireAuth, requireRole("admin"), assignChallenge);

export default router;
