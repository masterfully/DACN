import { Router } from "express";
import { sendSuccess } from "../utils/response";
import authRouter from "./authRoute";

const router = Router();

router.get("/health", (_req, res) => {
  sendSuccess(
    res,
    {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    200,
  );
});

router.use("/auth", authRouter);

export default router;
