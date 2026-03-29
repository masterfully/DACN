import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
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
      <MyClassesTable />
    </PageContainer>
  );
}
