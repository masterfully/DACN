import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createSubject, getSubjects, SubjectError, ErrorDetails } from "../services/subjectService";
import { sendError, sendSuccess } from "../utils/response";

// Validation schema for creating subject
const createSubjectSchema = z.object({
  subjectName: z.string().min(1, "Tên môn học là bắt buộc"),
  periods: z.number().int().positive("Số tiết phải là số nguyên dương"),
});

// Validation schema for query params
const getSubjectsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
});

export async function getSubjectsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validation = getSubjectsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(issue.message);
      });

      sendError(res, 400, "VALIDATION_ERROR", "Dữ liệu không hợp lệ", {
        formErrors: [],
        fieldErrors,
      });
      return;
    }

    const { page, limit, search } = validation.data;

    const { subjects, total } = await getSubjects(page, limit, search);

    sendSuccess(res, subjects, 200, {
      page,
      limit,
      total,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSubjectHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validation = createSubjectSchema.safeParse(req.body);

    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      
      validation.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(issue.message);
      });

      const details: ErrorDetails = {
        formErrors: [],
        fieldErrors,
      };

      sendError(res, 400, "VALIDATION_ERROR", "Dữ liệu không hợp lệ", details);
      return;
    }

    const { subjectName, periods } = validation.data;

    // Create subject
    const subject = await createSubject(subjectName, periods);

    sendSuccess(res, subject, 201);
  } catch (error) {
    if (error instanceof SubjectError) {
      sendError(res, error.statusCode, error.code, error.message, error.details);
      return;
    }
    next(error);
  }
}