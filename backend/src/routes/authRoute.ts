import { Router } from "express";
import * as authController from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.put("/change-password", requireAuth, authController.changePassword);
router.post("/register", authController.register);

export default router;
