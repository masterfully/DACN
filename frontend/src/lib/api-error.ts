import type { ApiError } from "@/types/api";

export type ErrorFieldAliasMap<TField extends string> = Partial<
  Record<TField, string | string[]>
>;

/**
 * Pick a user-facing form error message from API error object.
 */
export function getApiFormErrorMessage(
  error?: ApiError,
  fallback = "Có lỗi xảy ra. Vui lòng thử lại.",
): string {
  if (!error) return fallback;
  if (error.details?.formErrors?.length) {
    return error.details.formErrors[0];
  }
  return error.message || fallback;
}

/**
 * Map backend fieldErrors to UI form fields.
 * - If alias map is not provided, same-name field mapping is used.
 * - If alias map is provided, each UI field can map to one or many backend keys.
 */
export function mapApiFieldErrors<TField extends string>(
  error?: ApiError,
  aliases?: ErrorFieldAliasMap<TField>,
): Partial<Record<TField, string>> {
  const fieldErrors = error?.details?.fieldErrors;
  if (!fieldErrors) return {};

  const mapped: Partial<Record<TField, string>> = {};

  if (!aliases) {
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (messages?.length) {
        mapped[field as TField] = messages[0];
      }
    }
    return mapped;
  }

  for (const [uiField, apiFieldOrFields] of Object.entries(aliases) as Array<
    [TField, string | string[] | undefined]
  >) {
    if (!apiFieldOrFields) continue;
    const apiFields = Array.isArray(apiFieldOrFields)
      ? apiFieldOrFields
      : [apiFieldOrFields];

    for (const apiField of apiFields) {
      const messages = fieldErrors[apiField];
      if (messages?.length) {
        mapped[uiField] = messages[0];
        break;
      }
    }
  }

  return mapped;
}
