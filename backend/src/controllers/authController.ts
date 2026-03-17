import { Request, Response } from "express";
import { z } from "zod";
import { sendSuccess } from "../utils/response";
import { AppError } from "../middleware/errorHandler";
import * as authService from "../services/authService";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "fullName is required").max(255),
    username: z.string().trim().min(1, "username is required").max(255),
    email: z.string().trim().email("email is invalid").max(255),
    password: z
      .string()
      .min(8, "password must be at least 8 characters")
      .regex(
        passwordRegex,
        "password must include at least 1 uppercase letter, 1 number, and 1 special character",
      ),
    confirmPassword: z.string().min(1, "confirmPassword is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "confirmPassword must match password",
      });
    }
  });

export const register = async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("Invalid request body", {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

  const result = await authService.register({
    fullName: parsed.data.fullName,
    username: parsed.data.username,
    email: parsed.data.email,
    password: parsed.data.password,
  });

  sendSuccess(res, result, 201);
};
