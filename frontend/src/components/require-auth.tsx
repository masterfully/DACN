"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";

export function RequireAuth({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useAuthStore((s) => s.currentUser);
  const accessToken = useAuthStore((s) => s.accessToken);

  const isAuthed = Boolean(currentUser && accessToken);

  const loginHref = useMemo(() => {
    const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
    return `/${locale}/login${next}`;
  }, [locale, pathname]);

  useEffect(() => {
    if (!isAuthed) router.replace(loginHref);
  }, [isAuthed, loginHref, router]);

  if (!isAuthed) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center text-sm text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  return children;
}

