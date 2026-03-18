import { Router } from "express";
import { getSubjectsHandler, createSubjectHandler } from "../controllers/subjectController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/subjects - Get subjects list (Any auth)
router.get("/", requireAuth, getSubjectsHandler);

// POST /api/subjects - Create subject (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createSubjectHandler);

export default router;
