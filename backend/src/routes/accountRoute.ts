import { Router } from "express";
import {
  createAccountHandler,
  deleteAccountHandler,
  getAccountDetailHandler,
  getAccountsHandler,
  getMyAccountHandler,
  updateAccountHandler,
} from "../controllers/accountController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/accounts - List accounts (ADMIN only)
router.get("/", requireAuth, requireRole("ADMIN"), getAccountsHandler);

// POST /api/accounts - Create account (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createAccountHandler);

// GET /api/accounts/me - Get current account (any authenticated user)
router.get("/me", requireAuth, getMyAccountHandler);

// GET /api/accounts/:accountId - Get account detail (ADMIN only)
router.get("/:accountId", requireAuth, requireRole("ADMIN"), getAccountDetailHandler);

// PUT /api/accounts/:accountId - Update account (ADMIN only)
router.put("/:accountId", requireAuth, requireRole("ADMIN"), updateAccountHandler);

// DELETE /api/accounts/:accountId - Delete account (ADMIN only)
router.delete("/:accountId", requireAuth, requireRole("ADMIN"), deleteAccountHandler);

export default router;
