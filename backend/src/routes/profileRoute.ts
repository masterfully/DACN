import { Router } from "express";
import {
  createProfileHandler,
  getLecturerProfilesHandler,
  getMyProfileHandler,
  getProfilesHandler,
  getStudentProfilesHandler,
} from "../controllers/profileController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/profiles - Get profile list (ADMIN only)
router.get("/", requireAuth, requireRole("ADMIN"), getProfilesHandler);

// POST /api/profiles - Create profile (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createProfileHandler);

// GET /api/profiles/me - Get current user profile (Any auth)
router.get("/me", requireAuth, getMyProfileHandler);

// PUT /api/profiles/me - Update current user profile (Any auth)
import { updateMyProfileHandler } from "../controllers/profileController";
router.put("/me", requireAuth, updateMyProfileHandler);

// GET /api/profiles/students - Get student profile list (ADMIN, LECTURER)
router.get(
  "/students",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  getStudentProfilesHandler,
);

// GET /api/profiles/lecturers - Get lecturer profile list (ADMIN only)
router.get(
  "/lecturers",
  requireAuth,
  requireRole("ADMIN"),
  getLecturerProfilesHandler,
);

export default router;
