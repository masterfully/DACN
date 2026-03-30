import { Suspense } from "react";
import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { MyClassesTable } from "./my-classes-table";

export default function MyClassesPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Lớp học"
          description="Danh sách các lớp học mà bạn đang dạy."
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
        <MyClassesTable />
      </Suspense>
    </PageContainer>
  );
}
