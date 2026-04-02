import { Suspense } from "react";
import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentsTable } from "./students-table";

export default function StudentsPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Sinh viên"
          description="Quản lý sinh viên và các thông tin liên quan."
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
        <StudentsTable />
      </Suspense>
    </PageContainer>
  );
}
