import { Suspense } from "react";
import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionsTable } from "./sections-table";

export default function SectionsPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Học phần"
          description="Quản lý lớp học phần và lịch học."
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
        <SectionsTable />
      </Suspense>
    </PageContainer>
  );
}
