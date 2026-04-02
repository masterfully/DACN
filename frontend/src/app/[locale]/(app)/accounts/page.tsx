import { Suspense } from "react";
import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountsTable } from "./accounts-table";

export default function AccountsPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Tài khoản"
          description="Quản lý tài khoản và các thông tin liên quan."
        />
      }
    >
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-[min(24rem,50vh)] w-full rounded-md" />
          </div>
        }
      >
        <AccountsTable />
      </Suspense>
    </PageContainer>
  );
}
