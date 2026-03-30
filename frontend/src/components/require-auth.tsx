"use client";

import { useEffect, useMemo, useState } from "react";
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

  // Prevent hydration mismatch:
  // client auth state may not be available during the server render / first hydrate,
  // which would make SSR output "Redirecting..." but client output the real layout.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isAuthed = mounted && Boolean(currentUser && accessToken);

  const loginHref = useMemo(() => {
    const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
    return `/${locale}/login${next}`;
  }, [locale, pathname]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthed) router.replace(loginHref);
  }, [mounted, isAuthed, loginHref, router]);

  if (!mounted || !isAuthed) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center text-sm text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  return children;
}

