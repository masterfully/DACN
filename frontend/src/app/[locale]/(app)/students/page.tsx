import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
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
      <StudentsTable />
    </PageContainer>
  );
}
