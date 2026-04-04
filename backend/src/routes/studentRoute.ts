import { Router } from "express";
import { getStudentParentsHandler } from "../controllers/parentController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/students/:studentId/parents - List parents of a student (ADMIN only)
router.get(
  "/:studentId/parents",
  requireAuth,
  requireRole("ADMIN"),
  getStudentParentsHandler,
);

export default router;