import { z } from "zod";
import { AppError } from "../middleware/errorHandler";

const toFieldErrors = (error: z.ZodError): Record<string, string[]> => {
  const fieldErrors: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const field = issue.path.join(".") || "form";
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(issue.message);
  });

  return fieldErrors;
};

interface ParseOptions {
  code: string;
  message: string;
  statusCode?: number;
}

export const parseOrThrow = <S extends z.ZodTypeAny>(
  schema: S,
  input: unknown,
  options: ParseOptions,
): z.infer<S> => {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new AppError(options.message, {
      statusCode: options.statusCode ?? 400,
      code: options.code,
      details: {
        formErrors: [],
        fieldErrors: toFieldErrors(result.error),
      },
    });
  }

  return result.data;
};

interface ParsePositiveIntParamOptions extends ParseOptions {
  fieldName: string;
  fieldMessage: string;
}

export const parsePositiveIntParamOrThrow = (
  rawValue: string | string[] | undefined,
  options: ParsePositiveIntParamOptions,
): number => {
  const normalizedValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  const parsed = z.coerce.number().int().positive().safeParse(normalizedValue);

  if (!parsed.success) {
    throw new AppError(options.message, {
      statusCode: options.statusCode ?? 400,
      code: options.code,
      details: {
        formErrors: [],
        fieldErrors: {
          [options.fieldName]: [options.fieldMessage],
        },
      },
    });
  }

  return parsed.data;
};
