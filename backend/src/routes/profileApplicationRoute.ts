import { Router } from "express";
import {
  getApplicationsListHandler,
  submitApplicationHandler,
  getMyApplicationsHandler,
  getApplicationDetailHandler,
  updateApplicationHandler,
  reviewApplicationHandler,
  getApplicationCertificatesHandler,
} from "../controllers/profileApplicationController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// ADMIN: GET /api/profile-applications - Danh sách hồ sơ (paginated)
router.get("/", requireAuth, requireRole("ADMIN"), getApplicationsListHandler);

// STUDENT: POST /api/profile-applications - Nộp hồ sơ xét duyệt
router.post("/", requireAuth, requireRole("STUDENT"), submitApplicationHandler);

// STUDENT: GET /api/profile-applications/my-applications - Hồ sơ của tôi
router.get("/my-applications", requireAuth, requireRole("STUDENT"), getMyApplicationsHandler);

// ADMIN/STUDENT(own): GET /api/profile-applications/:id - Chi tiết hồ sơ
router.get("/:id", requireAuth, getApplicationDetailHandler);

// STUDENT(own, pending): PUT /api/profile-applications/:id - Cập nhật hồ sơ đang chờ
router.put("/:id", requireAuth, requireRole("STUDENT"), updateApplicationHandler);

// ADMIN: PATCH /api/profile-applications/:id/review - Xét duyệt hồ sơ
router.patch("/:id/review", requireAuth, requireRole("ADMIN"), reviewApplicationHandler);

// GET /api/profile-applications/:id/certificates - Chứng chỉ của hồ sơ
router.get("/:id/certificates", requireAuth, getApplicationCertificatesHandler);

export default router;

