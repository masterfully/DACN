import { Router } from "express";
import { createSectionHandler } from "../controllers/sectionController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// POST /api/sections - Create section (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createSectionHandler);

export default router;
