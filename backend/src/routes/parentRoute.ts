import { Router } from "express";
import {
  assignParentToStudentHandler,
  unassignParentFromStudentHandler,
} from "../controllers/parentController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// POST /api/parents/assign - Assign parent to student (ADMIN only)
router.post("/assign", requireAuth, requireRole("ADMIN"), assignParentToStudentHandler);

// DELETE /api/parents/assign - Unassign parent from student (ADMIN only)
router.delete(
  "/assign",
  requireAuth,
  requireRole("ADMIN"),
  unassignParentFromStudentHandler,
);

export default router;