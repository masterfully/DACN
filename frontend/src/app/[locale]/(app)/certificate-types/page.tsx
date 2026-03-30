import { Suspense } from "react";
import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { CertificateTypesTable } from "./certificate-types-table";

export default function CertificateTypesPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Loại chứng chỉ"
          description="Quản lý các loại chứng chỉ trong hệ thống."
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
        <CertificateTypesTable />
      </Suspense>
    </PageContainer>
  );
}
