"use client";

import useSWRMutation from "swr/mutation";
import type { ApiError, MutationResult } from "@/types/api";

export interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  mutateWithResult: (variables: TVariables) => Promise<MutationResult<TData>>;
  isLoading: boolean;
  error: ApiError | undefined;
}

/**
 * Hook for performing mutations with SWR
 *
 * @param key - The key to use for caching the mutation
 * @param mutationFn - The function to perform the mutation
 * @returns An object containing the mutate function, loading state, and error
 *
 * @example
 * ```tsx
 * const { mutate, isLoading, error } = useMutation<User, User>('/users', async (user) => {
 *   return await axios.post('/users', user);
 * });
 * ```
 */
export function useMutation<TData, TVariables>(
  key: string,
  mutationFn: (variables: TVariables) => Promise<TData>,
): UseMutationResult<TData, TVariables> {
  const { trigger, isMutating, error } = useSWRMutation<
    TData,
    ApiError,
    string,
    TVariables
  >(key, async (_, { arg }) => mutationFn(arg), {
    throwOnError: false,
  });

  const mutate = async (variables: TVariables) => {
    return (trigger as (arg: TVariables) => Promise<TData | undefined>)(
      variables,
    );
  };

  const mutateWithResult = async (
    variables: TVariables,
  ): Promise<MutationResult<TData>> => {
    try {
      const data = await (
        trigger as (
          arg: TVariables,
          options?: { throwOnError?: boolean },
        ) => Promise<TData>
      )(variables, { throwOnError: true });
      return { ok: true, data };
    } catch (caughtError) {
      return { ok: false, error: caughtError as ApiError };
    }
  };

  return {
    mutate,
    mutateWithResult,
    isLoading: isMutating,
    error,
  };
}
