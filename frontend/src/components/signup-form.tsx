"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/use-auth";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function SignupForm() {
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const { mutate: register, isLoading } = useRegister();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    try {
      const result = await register({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      if (!result) {
        setSubmitError("Không thể đăng ký. Vui lòng thử lại.");
        return;
      }

      setAuth({
        user: result.account,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      router.replace("/dashboard");
    } catch {
      setSubmitError("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Đăng ký</h1>
        <p className="text-sm text-muted-foreground">
          Tạo tài khoản để bắt đầu sử dụng hệ thống.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <label
            htmlFor="full-name"
            className="text-sm font-medium leading-none text-foreground"
          >
            Họ và tên
          </label>
          <input
            id="full-name"
            type="text"
            autoComplete="name"
            required
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>

        <div className="space-y-2 text-left">
          <label
            htmlFor="username"
            className="text-sm font-medium leading-none text-foreground"
          >
            Tên đăng nhập
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="space-y-2 text-left">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="space-y-2 text-left">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none text-foreground"
          >
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className="space-y-2 text-left">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium leading-none text-foreground"
          >
            Xác nhận mật khẩu
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
      </div>

      {submitError ? (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
      </Button>
    </form>
  );
}
