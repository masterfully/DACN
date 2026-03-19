import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/register", authController.register);

export default router;
