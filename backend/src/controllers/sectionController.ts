import { Request, Response } from "express";
import { sendSuccess } from "../utils/response";
import { parseOrThrow } from "../utils/validation";
import { createSection, createSectionSchema } from "../services/sectionService";
import { SECTION_ERROR_CODES } from "../constants/errors/section/codes";
import { SECTION_ERROR_MESSAGES } from "../constants/errors/section/messages";

export const createSectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = parseOrThrow(createSectionSchema, req.body, {
    code: SECTION_ERROR_CODES.SECTION_CREATE_INVALID_INPUT,
    message: SECTION_ERROR_MESSAGES.SECTION_CREATE_INVALID_INPUT,
  });

  const section = await createSection(payload);
  sendSuccess(res, section, 201);
};
