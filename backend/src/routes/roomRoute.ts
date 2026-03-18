import { Router } from 'express';
import * as roomController from '../controllers/roomController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// /api/rooms - Any auth
router.get('/', requireAuth, roomController.listRooms);
router.post('/', requireAuth, requireRole('ADMIN'), roomController.createRoom);

// /api/rooms/available - ADMIN only
router.get('/available', requireAuth, requireRole('ADMIN'), roomController.getAvailableRooms);

// /api/rooms/:roomId - Dynamic last
router.get('/:roomId', requireAuth, roomController.getRoom);
router.put('/:roomId', requireAuth, requireRole('ADMIN'), roomController.updateRoom);
router.delete('/:roomId', requireAuth, requireRole('ADMIN'), roomController.deleteRoom);
router.get('/:roomId/schedules', requireAuth, requireRole('ADMIN'), roomController.getRoomSchedules);
router.get('/:roomId/usage-histories', requireAuth, requireRole('ADMIN'), roomController.getRoomUsageHistories);

export default router;

