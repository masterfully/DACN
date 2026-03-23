import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { ApprovalsTable } from "./approvals-table";

export default function ApprovalsPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Xét duyệt hồ sơ"
          description="Danh sách hồ sơ chứng chỉ chờ xử lý. Duyệt hoặc từ chối theo quy định."
        />
      }
    >
      <ApprovalsTable />
    </PageContainer>
  );
}
