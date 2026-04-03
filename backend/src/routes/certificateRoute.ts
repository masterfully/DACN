import { Router } from "express";
import {
  listCertificatesHandler,
  createCertificateHandler,
  getCertificateHandler,
  updateCertificateHandler,
  deleteCertificateHandler,
} from "../controllers/certificateController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Admin: GET /api/certificates - Danh sách chứng chỉ
router.get("/", requireAuth, requireRole("ADMIN"), listCertificatesHandler);

// Admin: POST /api/certificates - Tạo chứng chỉ cho hồ sơ đã duyệt
router.post("/", requireAuth, requireRole("ADMIN"), createCertificateHandler);

// Admin/Owner: GET /api/certificates/:certificateId
router.get("/:certificateId", requireAuth, getCertificateHandler);

// Admin: PUT /api/certificates/:certificateId
router.put("/:certificateId", requireAuth, requireRole("ADMIN"), updateCertificateHandler);

// Admin: DELETE /api/certificates/:certificateId
router.delete("/:certificateId", requireAuth, requireRole("ADMIN"), deleteCertificateHandler);

export default router;
