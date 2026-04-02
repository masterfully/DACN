"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { AuthPasswordInput } from "@/components/auth-password-input";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/use-auth";
import { Link, useRouter } from "@/i18n/navigation";
import { getApiFormErrorMessage, mapApiFieldErrors } from "@/lib/api-error";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types/api";
import { Separator } from "./ui/separator";

type SignupField =
  | "fullName"
  | "username"
  | "email"
  | "password"
  | "confirmPassword";

const SIGNUP_FIELD_ORDER: SignupField[] = [
  "fullName",
  "username",
  "email",
  "password",
  "confirmPassword",
];

const SIGNUP_FIELD_DOM_ID: Record<SignupField, string> = {
  fullName: "full-name",
  username: "username",
  email: "email",
  password: "password",
  confirmPassword: "confirm-password",
};

export function SignupForm() {
  const t = useTranslations("Auth");
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<SignupField, string>>
  >({});
  const { mutateWithResult: register, isLoading } = useRegister();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const result = await register({
      fullName,
      username,
      email,
      password,
      confirmPassword,
    });

    if (!result.ok || !result.data) {
      const apiError = result.error as ApiError | undefined;
      const mapped = mapApiFieldErrors<SignupField>(apiError, {
        fullName: "fullName",
        username: "username",
        email: "email",
        password: "password",
        confirmPassword: ["confirmPassword", "passwordConfirmation"],
      });
      setFieldErrors(mapped);

      const hasFieldErrors = Object.keys(mapped).length > 0;
      setSubmitError(
        hasFieldErrors
          ? null
          : getApiFormErrorMessage(apiError, t("signupSubmitFailed")),
      );

      if (hasFieldErrors) {
        const firstWithError = SIGNUP_FIELD_ORDER.find((key) => mapped[key]);
        if (firstWithError) {
          const domId = SIGNUP_FIELD_DOM_ID[firstWithError];
          queueMicrotask(() => {
            requestAnimationFrame(() => {
              document.getElementById(domId)?.focus();
            });
          });
        }
      }

      return;
    }

    setAuth({
      user: result.data.account,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    });

    router.replace("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">{t("signupTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("signupDescription")}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <label
            htmlFor="full-name"
            className="text-foreground text-sm leading-none font-medium"
          >
            {t("fullNameLabel")}
          </label>
          <input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/60 flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          {fieldErrors.fullName ? (
            <p className="text-destructive text-sm" role="alert">
              {fieldErrors.fullName}
            </p>
          ) : null}
        </div>

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
          {fieldErrors.username ? (
            <p className="text-destructive text-sm" role="alert">
              {fieldErrors.username}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 text-left">
          <label
            htmlFor="email"
            className="text-foreground text-sm leading-none font-medium"
          >
            {t("emailLabel")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            required
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/60 flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {fieldErrors.email ? (
            <p className="text-destructive text-sm" role="alert">
              {fieldErrors.email}
            </p>
          ) : null}
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
            autoComplete="new-password"
            spellCheck={false}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {fieldErrors.password ? (
            <p className="text-destructive text-sm" role="alert">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 text-left">
          <label
            htmlFor="confirm-password"
            className="text-foreground text-sm leading-none font-medium"
          >
            {t("confirmPasswordLabel")}
          </label>
          <AuthPasswordInput
            id="confirm-password"
            name="confirmPassword"
            autoComplete="new-password"
            spellCheck={false}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {fieldErrors.confirmPassword ? (
            <p className="text-destructive text-sm" role="alert">
              {fieldErrors.confirmPassword}
            </p>
          ) : null}
        </div>
      </div>

      {submitError ? (
        <p className="text-destructive text-sm" role="alert">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("signupSubmitting") : t("signupSubmit")}
      </Button>

      <Separator />

      <div className="text-center text-sm">
        {t("promptHasAccount")}{" "}
        <Link href="/login" className="underline">
          {t("linkLogin")}
        </Link>
      </div>
    </form>
  );
}
