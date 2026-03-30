"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  type ListTableUrlKeyOptions,
  type ListTableUrlState,
  mergeListTableIntoSearchParams,
  parseListTableUrl,
} from "@/lib/list-table-url";

export function useListTableUrl(keyPrefix?: string) {
  const options = React.useMemo<ListTableUrlKeyOptions>(
    () => (keyPrefix ? { keyPrefix } : {}),
    [keyPrefix],
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const state = React.useMemo(
    () => parseListTableUrl(searchParams, options),
    [searchParams, options],
  );

  const replaceState = React.useCallback(
    (next: ListTableUrlState) => {
      const qs = mergeListTableIntoSearchParams(searchParams, next, options);
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams, options],
  );

  return { state, replaceState };
}
