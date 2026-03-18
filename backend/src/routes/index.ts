import { Router } from "express";
import { sendSuccess } from "../utils/response";
import authRouter from "./authRoute";
import subjectRoute from "./subjectRoute";
import authRoute from "./authRoute";

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

// Mount subject routes
router.use("/subjects", subjectRoute);

// Mount auth routes
router.use("/auth", authRoute);

export default router;
