import { Router } from "express";
import { sendSuccess } from "../utils/response";

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

export default router;
