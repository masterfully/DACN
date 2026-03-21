import { Router } from 'express';
import * as usageHistoryController from '../controllers/usageHistoryController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

/* ============================================================
   ROUTES
============================================================ */

// LIST
router.get(
  '/',
  requireAuth,
  usageHistoryController.listUsageHistories
);

// CREATE
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  usageHistoryController.createUsageHistory
);

// DETAIL
router.get(
  '/:usageHistoryId',
  requireAuth,
  usageHistoryController.getUsageHistory
);

// UPDATE
router.put(
  '/:usageHistoryId',
  requireAuth,
  requireRole('ADMIN'),
  usageHistoryController.updateUsageHistory
);

// DELETE
router.delete(
  '/:usageHistoryId',
  requireAuth,
  requireRole('ADMIN'),
  usageHistoryController.deleteUsageHistory
);

// LINK SECTION
router.post(
  '/:usageHistoryId/sections/:sectionId',
  requireAuth,
  requireRole('ADMIN'),
  usageHistoryController.linkSection
);

// UNLINK SECTION
router.delete(
  '/:usageHistoryId/sections/:sectionId',
  requireAuth,
  requireRole('ADMIN'),
  usageHistoryController.unlinkSection
);

export default router;