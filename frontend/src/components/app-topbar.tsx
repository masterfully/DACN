"use client";

import { Check, Globe, LogOut, Monitor, Moon, Sun, User } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/use-auth";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const DEFAULT_ACCOUNT_NAME = "Nguyễn Văn A";

// function getInitials(name: string) {
//   const parts = name.trim().split(/\s+/);
//   if (!parts.length) return "";

//   const first = parts[0]?.[0] ?? "";
//   const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

//   return (first + last).toUpperCase();
// }

export function AppTopbar({
  accountName = DEFAULT_ACCOUNT_NAME,
}: {
  accountName?: string;
}) {
  const { theme, setTheme } = useTheme();
  const tTheme = useTranslations("ThemeToggle");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useAuthStore((state) => state.currentUser);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { mutate: logout, isLoading: isLoggingOut } = useLogout();

  // const initials = getInitials(accountName);
  const resolvedAccountName =
    currentUser?.profile?.fullName ?? currentUser?.username ?? accountName;

  const languages = [
    {
      locale: "en",
      label: "English",
    },
    {
      locale: "vi",
      label: "Tiếng Việt",
    },
  ];

  function changeLocale(targetLocale: string) {
    router.replace(pathname, { locale: targetLocale });
  }

  async function handleLogout() {
    try {
      if (refreshToken) {
        await logout({ refreshToken });
      }
    } finally {
      clearAuth();
      router.replace("/login");
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />

      <div className="flex flex-1 items-center justify-between gap-2">
        <div className="text-sm font-medium">Academic Portal</div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar size="lg" className="cursor-pointer">
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-medium">
              {resolvedAccountName}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User />
                <span>Thông tin tài khoản</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Monitor />
                <span>Hiển thị</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-52">
                <DropdownMenuItem
                  className={cn(theme === "light" && "bg-muted")}
                  onClick={() => setTheme("light")}
                >
                  <Sun />
                  <span>{tTheme("light")}</span>
                  {theme === "light" && (
                    <DropdownMenuShortcut>
                      <Check className="size-4" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(theme === "dark" && "bg-muted")}
                  onClick={() => {
                    setTheme("dark");
                  }}
                >
                  <Moon />
                  <span>{tTheme("dark")}</span>
                  {theme === "dark" && (
                    <DropdownMenuShortcut>
                      <Check className="size-4" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(theme === "system" && "bg-muted")}
                  onClick={() => {
                    setTheme("system");
                  }}
                >
                  <Monitor />
                  <span>{tTheme("system")}</span>
                  {theme === "system" && (
                    <DropdownMenuShortcut>
                      <Check className="size-4" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Globe />
                <span>Ngôn ngữ</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-52">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.locale}
                    className={cn(locale === language.locale && "bg-muted")}
                    onClick={() => {
                      changeLocale(language.locale);
                    }}
                  >
                    <div className="flex size-4 items-center justify-center text-xs font-medium">
                      {language.locale.toUpperCase()}
                    </div>
                    <span>{language.label}</span>
                    {locale === language.locale && (
                      <DropdownMenuShortcut>
                        <Check className="size-4" />
                      </DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              disabled={isLoggingOut}
              onClick={() => {
                void handleLogout();
              }}
            >
              <LogOut />
              <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
