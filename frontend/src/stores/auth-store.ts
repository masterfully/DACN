"use client";

import { create } from "zustand";
import { AUTH_STORAGE_KEYS } from "@/lib/auth-storage";
import type { AuthAccount } from "@/types/auth";

interface SetAuthPayload {
  user: AuthAccount;
  accessToken: string;
  refreshToken: string;
}

interface TokensPayload {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  currentUser: AuthAccount | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (payload: SetAuthPayload) => void;
  setTokens: (payload: TokensPayload) => void;
  clearAuth: () => void;
  hydrateFromStorage: () => void;
}

const readCurrentUser = (): AuthAccount | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.currentUser);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthAccount;
  } catch {
    return null;
  }
};

const readAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
};

const readRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: readCurrentUser(),
  accessToken: readAccessToken(),
  refreshToken: readRefreshToken(),
  setAuth: ({ user, accessToken, refreshToken }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, JSON.stringify(user));
      localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
    }

    set({
      currentUser: user,
      accessToken,
      refreshToken,
    });
  },
  setTokens: ({ accessToken, refreshToken }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
    }

    set({
      accessToken,
      refreshToken,
    });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
      localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
      localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
    }

    set({
      currentUser: null,
      accessToken: null,
      refreshToken: null,
    });
  },
  hydrateFromStorage: () => {
    set({
      currentUser: readCurrentUser(),
      accessToken: readAccessToken(),
      refreshToken: readRefreshToken(),
    });
  },
}));
