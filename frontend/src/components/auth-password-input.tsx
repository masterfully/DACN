"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthPasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const t = useTranslations("Auth");
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className={cn(
          "border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/60 h-9 w-full min-w-0 rounded-md border py-1 pr-10 pl-3 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none",
          className,
        )}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground absolute top-0 right-0 size-9"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("hidePassword") : t("showPassword")}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </Button>
    </div>
  );
}
