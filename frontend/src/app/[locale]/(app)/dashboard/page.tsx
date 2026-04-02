import { getTranslations } from "next-intl/server";
import { PageSectionHeader } from "@/components/page-section-header";
import { Link } from "@/i18n/navigation";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageSectionHeader title={t("title")} description={t("description")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/approvals"
          className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm transition-colors hover:bg-muted/50"
        >
          <h2 className="font-semibold">{t("ctaApprovalsTitle")}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("ctaApprovalsDesc")}
          </p>
        </Link>
        <Link
          href="/profile"
          className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm transition-colors hover:bg-muted/50"
        >
          <h2 className="font-semibold">{t("ctaProfileTitle")}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("ctaProfileDesc")}
          </p>
        </Link>
      </div>
    </div>
  );
}
