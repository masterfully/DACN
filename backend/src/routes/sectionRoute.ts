import { Router } from "express";
import {
  createSectionHandler,
  getSectionsHandler,
} from "../controllers/sectionController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/sections - List sections (ADMIN only)
router.get("/", requireAuth, requireRole("ADMIN"), getSectionsHandler);

// POST /api/sections - Create section (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createSectionHandler);

export default router;
