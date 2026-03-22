import { Router } from "express";
import { createRegistrationHandler } from "../controllers/registrationController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// POST /api/registrations - Register section (STUDENT only)
router.post("/", requireAuth, requireRole("STUDENT"), createRegistrationHandler);

export default router;
