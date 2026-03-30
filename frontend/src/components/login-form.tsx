"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { AuthPasswordInput } from "@/components/auth-password-input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-auth";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Separator } from "./ui/separator";

export function LoginForm() {
  const t = useTranslations("Auth");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const { mutate: login, isLoading } = useLogin();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    try {
      const result = await login({
        username,
        password,
      });

      if (!result) {
        setSubmitError(t("loginErrorGeneric"));
        return;
      }

      setAuth({
        user: result.account,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      const next = searchParams.get("next");
      const isSafeNext =
        typeof next === "string" &&
        next.startsWith("/") &&
        !next.startsWith("//") &&
        !next.includes("\\");

      if (isSafeNext) {
        const localePrefix = `/${locale}`;
        const nextPath =
          next === localePrefix
            ? "/"
            : next.startsWith(`${localePrefix}/`)
              ? next.slice(localePrefix.length)
              : next;

        router.replace(nextPath);
        return;
      }

      router.replace("/dashboard");
    } catch {
      setSubmitError(t("loginErrorInvalid"));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">{t("loginTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("loginDescription")}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <label
            htmlFor="username"
            className="text-foreground text-sm leading-none font-medium"
          >
            {t("usernameLabel")}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            spellCheck={false}
            required
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/60 flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="space-y-2 text-left">
          <label
            htmlFor="password"
            className="text-foreground text-sm leading-none font-medium"
          >
            {t("passwordLabel")}
          </label>
          <AuthPasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            spellCheck={false}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>

      {submitError ? (
        <p className="text-destructive text-sm" role="alert">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("loginSubmitting") : t("loginSubmit")}
      </Button>

      <Separator />

      <div className="text-center text-sm">
        {t("promptNoAccount")}{" "}
        <Link href="/signup" className="underline">
          {t("linkSignup")}
        </Link>
      </div>
    </form>
  );
}
