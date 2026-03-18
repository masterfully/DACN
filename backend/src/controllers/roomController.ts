import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import * as roomService from '../services/roomService';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';

// Use service schemas for validation
const { createRoomSchema, updateRoomSchema, listRoomsSchema, availableRoomsSchema } = roomService;

// Controller functions matching TASK.md endpoints
export const listRooms = async (req: Request, res: Response) => {
  const validated = listRoomsSchema.parse({ ...req.query });
  const result = await roomService.listRooms(validated);
  sendSuccess(res, result.data, 200, result.meta);
};

export const createRoom = async (req: Request, res: Response) => {
  const data = createRoomSchema.parse(req.body);
  const room = await roomService.createRoom(data);
  sendSuccess(res, room, 201);
};

export const getAvailableRooms = async (req: Request, res: Response) => {
  const validated = availableRoomsSchema.parse(req.query);
  const rooms = await roomService.getAvailableRooms(validated);
  sendSuccess(res, rooms, 200);
};

export const getRoom = async (req: Request, res: Response) => {
  const roomId = parseInt(req.params.roomId);
  const room = await roomService.getRoom(roomId);
  sendSuccess(res, room, 200);
};

export const updateRoom = async (req: Request, res: Response) => {
  const roomId = parseInt(req.params.roomId);
  const data = updateRoomSchema.parse(req.body);
  const room = await roomService.updateRoom(roomId, data);
  sendSuccess(res, room, 200);
};

export const deleteRoom = async (req: Request, res: Response) => {
  const roomId = parseInt(req.params.roomId);
  await roomService.deleteRoom(roomId);
  sendSuccess(res, null, 200);
};

export const getRoomSchedules = async (req: Request, res: Response) => {
  const roomId = parseInt(req.params.roomId);
  const schedules = await roomService.getRoomSchedules(roomId);
  sendSuccess(res, schedules, 200);
};

export const getRoomUsageHistories = async (req: Request, res: Response) => {
  const roomId = parseInt(req.params.roomId);
  const histories = await roomService.getRoomUsageHistories(roomId);
  sendSuccess(res, histories, 200);
};

