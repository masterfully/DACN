import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { SubjectsTable } from "./subjects-table";

export default function SubjectsPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Môn học"
          description="Quản lý môn học và các thông tin liên quan."
        />
      }
    >
      <SubjectsTable />
    </PageContainer>
  );
}
