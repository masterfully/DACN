import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
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
      <CertificateTypesTable />
    </PageContainer>
  );
}
