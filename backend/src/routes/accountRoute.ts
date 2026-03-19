import { Router } from "express";
import {
  createAccountHandler,
  getAccountsHandler,
} from "../controllers/accountController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/accounts - List accounts (ADMIN only)
router.get("/", requireAuth, requireRole("ADMIN"), getAccountsHandler);

// POST /api/accounts - Create account (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createAccountHandler);

export default router;
