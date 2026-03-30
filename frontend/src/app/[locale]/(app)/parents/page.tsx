import { Suspense } from "react";
import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ParentsTable } from "./parentsTable";

export default function ParentsPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Phụ huynh"
          description="Quản lý phụ huynh và các thông tin liên quan."
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
        <ParentsTable />
      </Suspense>
    </PageContainer>
  );
}
