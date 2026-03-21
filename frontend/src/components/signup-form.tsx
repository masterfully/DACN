"use client";

import * as React from "react";
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

export function SignupForm() {
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
      setFieldErrors(
        mapApiFieldErrors<SignupField>(apiError, {
          fullName: "fullName",
          username: "username",
          email: "email",
          password: "password",
          confirmPassword: ["confirmPassword", "passwordConfirmation"],
        }),
      );
      setSubmitError(
        getApiFormErrorMessage(
          apiError,
          "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.",
        ),
      );
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
        <h1 className="text-2xl font-semibold tracking-tight">Đăng ký</h1>
        <p className="text-muted-foreground text-sm">
          Tạo tài khoản để bắt đầu sử dụng hệ thống.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <label
            htmlFor="full-name"
            className="text-foreground text-sm leading-none font-medium"
          >
            Họ và tên
          </label>
          <input
            id="full-name"
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
            Tên đăng nhập
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
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
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
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
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/60 flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
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
            Xác nhận mật khẩu
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/60 flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
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

      <Separator />

      <div className="text-center text-sm">
        Bạn đã có tài khoản?{" "}
        <Link href="/login" className="underline">
          Đăng nhập
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
      </Button>
    </form>
  );
}
