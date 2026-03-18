import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import * as roomService from '../services/roomService';
import { parseOrThrow, parsePositiveIntParamOrThrow } from '../utils/validation';
import { ROOM_ERROR_CODES } from '../constants/errors/room/codes';
import {
  ROOM_ERROR_MESSAGES,
  ROOM_FIELD_ERROR_MESSAGES,
  ROOM_SUCCESS_MESSAGES,
} from '../constants/errors/room/messages';

// Use service schemas for validation
const { createRoomSchema, updateRoomSchema, listRoomsSchema, availableRoomsSchema } = roomService;

// Controller functions matching TASK.md endpoints
export const listRooms = async (req: Request, res: Response) => {
  const validated = parseOrThrow(
    listRoomsSchema,
    { ...req.query },
    {
      code: ROOM_ERROR_CODES.ROOM_LIST_INVALID_QUERY,
      message: ROOM_ERROR_MESSAGES.ROOM_LIST_INVALID_QUERY,
    },
  );
  const result = await roomService.listRooms(validated);
  sendSuccess(res, result.data, 200, result.meta);
};

export const createRoom = async (req: Request, res: Response) => {
  const data = parseOrThrow(
    createRoomSchema,
    req.body,
    {
      code: ROOM_ERROR_CODES.ROOM_CREATE_INVALID_INPUT,
      message: ROOM_ERROR_MESSAGES.ROOM_CREATE_INVALID_INPUT,
    },
  );
  const room = await roomService.createRoom(data);
  sendSuccess(res, room, 201);
};

export const getAvailableRooms = async (req: Request, res: Response) => {
  const validated = parseOrThrow(
    availableRoomsSchema,
    req.query,
    {
      code: ROOM_ERROR_CODES.ROOM_AVAILABILITY_INVALID_QUERY,
      message: ROOM_ERROR_MESSAGES.ROOM_AVAILABILITY_INVALID_QUERY,
    },
  );
  const rooms = await roomService.getAvailableRooms(validated);
  sendSuccess(res, rooms, 200);
};

export const getRoom = async (req: Request, res: Response) => {
  const roomId = parsePositiveIntParamOrThrow(req.params.roomId, {
    code: ROOM_ERROR_CODES.ROOM_PARAM_INVALID_ID,
    message: ROOM_ERROR_MESSAGES.ROOM_PARAM_INVALID_ID,
    fieldName: 'roomId',
    fieldMessage: ROOM_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID,
  });
  const room = await roomService.getRoom(roomId);
  sendSuccess(res, room, 200);
};

export const updateRoom = async (req: Request, res: Response) => {
  const roomId = parsePositiveIntParamOrThrow(req.params.roomId, {
    code: ROOM_ERROR_CODES.ROOM_PARAM_INVALID_ID,
    message: ROOM_ERROR_MESSAGES.ROOM_PARAM_INVALID_ID,
    fieldName: 'roomId',
    fieldMessage: ROOM_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID,
  });
  const data = parseOrThrow(
    updateRoomSchema,
    req.body,
    {
      code: ROOM_ERROR_CODES.ROOM_UPDATE_INVALID_INPUT,
      message: ROOM_ERROR_MESSAGES.ROOM_UPDATE_INVALID_INPUT,
    },
  );
  const room = await roomService.updateRoom(roomId, data);
  sendSuccess(res, room, 200);
};

export const deleteRoom = async (req: Request, res: Response) => {
  const roomId = parsePositiveIntParamOrThrow(req.params.roomId, {
    code: ROOM_ERROR_CODES.ROOM_PARAM_INVALID_ID,
    message: ROOM_ERROR_MESSAGES.ROOM_PARAM_INVALID_ID,
    fieldName: 'roomId',
    fieldMessage: ROOM_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID,
  });
  const deletedRoom = await roomService.deleteRoom(roomId);
  sendSuccess(
    res,
    {
      message: ROOM_SUCCESS_MESSAGES.ROOM_DELETE_SUCCESS,
      ...deletedRoom,
    },
    200,
  );
};

export const getRoomSchedules = async (req: Request, res: Response) => {
  const roomId = parsePositiveIntParamOrThrow(req.params.roomId, {
    code: ROOM_ERROR_CODES.ROOM_PARAM_INVALID_ID,
    message: ROOM_ERROR_MESSAGES.ROOM_PARAM_INVALID_ID,
    fieldName: 'roomId',
    fieldMessage: ROOM_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID,
  });
  const schedules = await roomService.getRoomSchedules(roomId);
  sendSuccess(res, schedules, 200);
};

export const getRoomUsageHistories = async (req: Request, res: Response) => {
  const roomId = parsePositiveIntParamOrThrow(req.params.roomId, {
    code: ROOM_ERROR_CODES.ROOM_PARAM_INVALID_ID,
    message: ROOM_ERROR_MESSAGES.ROOM_PARAM_INVALID_ID,
    fieldName: 'roomId',
    fieldMessage: ROOM_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID,
  });
  const histories = await roomService.getRoomUsageHistories(roomId);
  sendSuccess(res, histories, 200);
};

