import { Router } from "express";
import {
  createAttendanceHandler,
  deleteAttendanceHandler,
  getAttendanceDetailHandler,
  getAttendancesHandler,
  updateAttendanceHandler,
} from "../controllers/attendanceController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/attendances - List attendances (ADMIN only)
router.get("/", requireAuth, requireRole("ADMIN"), getAttendancesHandler);

// POST /api/attendances - Create attendance session (LECTURER only)
router.post("/", requireAuth, requireRole("LECTURER"), createAttendanceHandler);

// GET /api/attendances/:attendanceId - Attendance detail (ADMIN, LECTURER)
router.get(
  "/:attendanceId",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  getAttendanceDetailHandler,
);

// PUT /api/attendances/:attendanceId - Update attendance (LECTURER only)
router.put(
  "/:attendanceId",
  requireAuth,
  requireRole("LECTURER"),
  updateAttendanceHandler,
);

// DELETE /api/attendances/:attendanceId - Delete attendance (ADMIN, LECTURER)
router.delete(
  "/:attendanceId",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  deleteAttendanceHandler,
);

export default router;
