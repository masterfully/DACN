import { Router } from "express";
import {
  createSubjectHandler,
  deleteSubjectHandler,
  getSubjectDetailHandler,
  getSubjectsHandler,
  updateSubjectHandler,
} from "../controllers/subjectController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/subjects - Get subjects list (Any auth)
router.get("/", requireAuth, getSubjectsHandler);

// POST /api/subjects - Create subject (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createSubjectHandler);

// GET /api/subjects/:subjectId - Get subject detail (Any auth)
router.get("/:subjectId", requireAuth, getSubjectDetailHandler);

// PUT /api/subjects/:subjectId - Update subject (ADMIN only)
router.put("/:subjectId", requireAuth, requireRole("ADMIN"), updateSubjectHandler);

// DELETE /api/subjects/:subjectId - Delete subject (ADMIN only)
router.delete(
  "/:subjectId",
  requireAuth,
  requireRole("ADMIN"),
  deleteSubjectHandler,
);

export default router;
