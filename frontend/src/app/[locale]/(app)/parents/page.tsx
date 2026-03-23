import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
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
      <ParentsTable />
    </PageContainer>
  );
}
