import { Router } from "express";
import {
  listCertificateTypesHandler,
  createCertificateTypeHandler,
  getCertificateTypeHandler,
  updateCertificateTypeHandler,
  deleteCertificateTypeHandler,
} from "../controllers/certificateTypeController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Public read: GET /api/certificate-types - Danh sách loại chứng chỉ
router.get("/", listCertificateTypesHandler);

// Admin write: POST /api/certificate-types - Tạo loại chứng chỉ
router.post("/", requireAuth, requireRole("ADMIN"), createCertificateTypeHandler);

// Public read: GET /api/certificate-types/:typeId
router.get("/:typeId", getCertificateTypeHandler);

// Admin write: PUT /api/certificate-types/:typeId
router.put("/:typeId", requireAuth, requireRole("ADMIN"), updateCertificateTypeHandler);

// Admin write: DELETE /api/certificate-types/:typeId
router.delete("/:typeId", requireAuth, requireRole("ADMIN"), deleteCertificateTypeHandler);

export default router;
