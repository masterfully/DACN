import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
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
      <SectionsTable />
    </PageContainer>
  );
}
