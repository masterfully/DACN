import { getTranslations } from "next-intl/server";

import { SignupForm } from "@/components/signup-form";
import { Link } from "@/i18n/navigation";

export default async function SignupPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <span className="text-xs font-semibold tracking-wide uppercase">
                {t("brandInitials")}
              </span>
            </div>
            <span>{t("brandName")}</span>
          </Link>
        </div>
        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 items-center justify-center outline-none"
        >
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </main>
      </div>
      {/* <div className="bg-muted relative hidden lg:block">
        <Image
          src="/window.svg"
          alt="Signup illustration"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div> */}
    </div>
  );
}
