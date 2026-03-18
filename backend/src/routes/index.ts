import { Router } from "express";
import { sendSuccess } from "../utils/response";
import authRouter from "./authRoute";
import roomRoute from "./roomRoute";
import subjectRoute from "./subjectRoute";

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

// Mount room routes
router.use("/rooms", roomRoute);

export default router;
