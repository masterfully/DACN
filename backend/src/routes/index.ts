import { Router } from "express";
import { sendSuccess } from "../utils/response";
import accountRouter from "./accountRoute";
import authRouter from "./authRoute";
import profileRoute from "./profileRoute";
import registrationRoute from "./registrationRoute";
import roomRoute from "./roomRoute";
import usageHistoryRoute from "./usageHistoryRoute";
import sectionRoute from "./sectionRoute";
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

// Mount account routes
router.use("/accounts", accountRouter);

// Mount profile routes
router.use("/profiles", profileRoute);

// Mount subject routes
router.use("/subjects", subjectRoute);

// Mount section routes
router.use("/sections", sectionRoute);

// Mount registration routes
router.use("/registrations", registrationRoute);

// Mount room routes
router.use("/rooms", roomRoute);
router.use("/usage-histories", usageHistoryRoute);

export default router;
