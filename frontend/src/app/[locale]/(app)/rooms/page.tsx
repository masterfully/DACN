import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { RoomsTable } from "./rooms-table";

export default function RoomsPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Phòng học"
          description="Quản lý phòng học và các thông tin liên quan."
        />
      }
    >
      <RoomsTable />
    </PageContainer>
  );
}
