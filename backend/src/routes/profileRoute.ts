import { Router } from "express";
import {
  addProfileCertificateHandler,
  createProfileHandler,
  getLecturerProfilesHandler,
  getProfileAttendanceSummaryHandler,
  getProfileCertificatesHandler,
  getProfileDetailHandler,
  getMyProfileHandler,
  getProfilesHandler,
  getStudentProfilesHandler,
  removeProfileCertificateHandler,
  updateMyProfileHandler,
  updateProfileByIdHandler,
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

// GET /api/profiles/:profileId/attendance-summary - Attendance summary (ADMIN, LECTURER, owner)
router.get(
  "/:profileId/attendance-summary",
  requireAuth,
  getProfileAttendanceSummaryHandler,
);

// GET /api/profiles/:profileId/certificates - Profile certificates (ADMIN or owner)
router.get(
  "/:profileId/certificates",
  requireAuth,
  getProfileCertificatesHandler,
);

// POST /api/profiles/:profileId/certificates - Link certificate to student (ADMIN only)
router.post(
  "/:profileId/certificates",
  requireAuth,
  requireRole("ADMIN"),
  addProfileCertificateHandler,
);

// DELETE /api/profiles/:profileId/certificates/:certificateId - Unlink certificate (ADMIN only)
router.delete(
  "/:profileId/certificates/:certificateId",
  requireAuth,
  requireRole("ADMIN"),
  removeProfileCertificateHandler,
);

// GET /api/profiles/:profileId - Get profile detail by ID (ADMIN or owner)
router.get("/:profileId", requireAuth, getProfileDetailHandler);

// PUT /api/profiles/:profileId - Update profile by ID (ADMIN or owner)
router.put("/:profileId", requireAuth, updateProfileByIdHandler);

export default router;
