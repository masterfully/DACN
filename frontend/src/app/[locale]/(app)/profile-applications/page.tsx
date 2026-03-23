import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { ProfileApplicationsForm } from "./profile-applications-form";

export default function ProfileApplicationsPage() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Nộp hồ sơ chứng chỉ"
          description="Tạo hồ sơ, đính kèm chứng chỉ và gửi để được xét duyệt."
        />
      }
    >
      <ProfileApplicationsForm />
    </PageContainer>
  );
}
