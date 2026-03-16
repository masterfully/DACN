import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { LecturersTable } from "./lecturers-table";

export default function LecturersPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Giảng viên"
          description="Quản lý giảng viên và các thông tin liên quan."
        />
      }
    >
      <LecturersTable />
    </PageContainer>
  );
}
