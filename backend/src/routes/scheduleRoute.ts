import { Router } from "express";
import {
  createScheduleHandler,
  deleteScheduleHandler,
  getMyScheduleHandler,
  getScheduleDetailHandler,
  getSchedulesHandler,
  updateScheduleHandler,
} from "../controllers/scheduleController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/schedules - List schedules (ADMIN only)
router.get("/", requireAuth, requireRole("ADMIN"), getSchedulesHandler);

// GET /api/schedules/my-schedule - Current user's schedule (Any auth)
router.get("/my-schedule", requireAuth, getMyScheduleHandler);

// POST /api/schedules - Create schedule (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createScheduleHandler);

// GET /api/schedules/:scheduleId - Schedule detail (Any auth)
router.get("/:scheduleId", requireAuth, getScheduleDetailHandler);

// PUT /api/schedules/:scheduleId - Update schedule (ADMIN only)
router.put("/:scheduleId", requireAuth, requireRole("ADMIN"), updateScheduleHandler);

// DELETE /api/schedules/:scheduleId - Delete schedule (ADMIN only)
router.delete("/:scheduleId", requireAuth, requireRole("ADMIN"), deleteScheduleHandler);

export default router;

