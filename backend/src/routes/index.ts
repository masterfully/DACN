import { Router } from "express";
import { sendSuccess } from "../utils/response";
import accountRouter from "./accountRoute";
import attendanceRoute from "./attendanceRoute";
import authRouter from "./authRoute";
import profileRoute from "./profileRoute";
import registrationRoute from "./registrationRoute";
import roomRoute from "./roomRoute";
import scheduleRoute from "./scheduleRoute";
import usageHistoryRoute from "./usageHistoryRoute";
import sectionRoute from "./sectionRoute";
import subjectRoute from "./subjectRoute";
import certificateTypeRoute from "./certificateTypeRoute";
import certificateRoute from "./certificateRoute";
import profileApplicationRoute from "./profileApplicationRoute";

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

// Mount schedule routes
router.use("/schedules", scheduleRoute);

// Mount attendance routes
router.use("/attendances", attendanceRoute);

// Mount room routes
router.use("/rooms", roomRoute);
router.use("/usage-histories", usageHistoryRoute);
router.use("/certificate-types", certificateTypeRoute);
router.use("/certificates", certificateRoute);
router.use("/profile-applications", profileApplicationRoute);

export default router;
