import { Router } from "express";
import {
  createSectionHandler,
  getSectionsHandler,
} from "../controllers/sectionController";
import { getRegistrationsBySectionHandler } from "../controllers/registrationController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/sections - List sections (ADMIN only)
router.get("/", requireAuth, requireRole("ADMIN"), getSectionsHandler);

// POST /api/sections - Create section (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createSectionHandler);

// GET /api/sections/:sectionId/registrations - Section registration list (ADMIN, LECTURER)
router.get(
  "/:sectionId/registrations",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  getRegistrationsBySectionHandler,
);

export default router;
