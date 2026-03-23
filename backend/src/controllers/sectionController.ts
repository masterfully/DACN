import { Request, Response } from "express";
import { sendSuccess } from "../utils/response";
import { parseOrThrow } from "../utils/validation";
import {
  createSection,
  createSectionSchema,
  getSections,
  getSectionsQuerySchema,
} from "../services/sectionService";
import { SECTION_ERROR_CODES } from "../constants/errors/section/codes";
import { SECTION_ERROR_MESSAGES } from "../constants/errors/section/messages";

export const getSectionsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(getSectionsQuerySchema, req.query, {
    code: SECTION_ERROR_CODES.SECTION_LIST_INVALID_QUERY,
    message: SECTION_ERROR_MESSAGES.SECTION_LIST_INVALID_QUERY,
  });

  const result = await getSections(query);
  sendSuccess(res, result.sections, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

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
