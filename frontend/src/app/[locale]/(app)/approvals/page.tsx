import { Suspense } from "react";
import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ApprovalsTable } from "./approvals-table";

export default function ApprovalsPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Xét duyệt hồ sơ"
          description="Danh sách hồ sơ chứng chỉ chờ xử lý. Duyệt hoặc từ chối theo quy định."
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
        <ApprovalsTable />
      </Suspense>
    </PageContainer>
  );
}
