export const LIST_TABLE_ALLOWED_LIMITS = new Set([10, 20, 50, 100]);

export type ListTableUrlState = {
  page: number;
  limit: number;
  q: string;
};

export type ListTableUrlKeyOptions = {
  /** e.g. `"open"` → params `openPage`, `openLimit`, `openQ` */
  keyPrefix?: string;
};

function paramKeys(options: ListTableUrlKeyOptions) {
  const p = options.keyPrefix;
  if (!p) {
    return { page: "page", limit: "limit", q: "q" };
  }
  return {
    page: `${p}Page`,
    limit: `${p}Limit`,
    q: `${p}Q`,
  };
}

export function parseListTableUrl(
  sp: URLSearchParams,
  options: ListTableUrlKeyOptions = {},
): ListTableUrlState {
  const k = paramKeys(options);
  const pageRaw = Number.parseInt(sp.get(k.page) ?? "1", 10);
  const page =
    Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  const limitRaw = Number.parseInt(sp.get(k.limit) ?? "10", 10);
  const limit = LIST_TABLE_ALLOWED_LIMITS.has(limitRaw) ? limitRaw : 10;

  const q = sp.get(k.q) ?? "";

  return { page, limit, q };
}

/** Mutates `params`: sets or deletes only list-table keys (preserves other query keys). */
export function applyListTableUrlToParams(
  params: URLSearchParams,
  state: ListTableUrlState,
  options: ListTableUrlKeyOptions = {},
): void {
  const k = paramKeys(options);
  if (state.page !== 1) params.set(k.page, String(state.page));
  else params.delete(k.page);
  if (state.limit !== 10) params.set(k.limit, String(state.limit));
  else params.delete(k.limit);
  const qt = state.q.trim();
  if (qt) params.set(k.q, qt);
  else params.delete(k.q);
}

export function mergeListTableIntoSearchParams(
  current: URLSearchParams,
  state: ListTableUrlState,
  options: ListTableUrlKeyOptions = {},
): string {
  const next = new URLSearchParams(current.toString());
  applyListTableUrlToParams(next, state, options);
  return next.toString();
}
