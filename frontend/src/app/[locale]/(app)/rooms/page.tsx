import { PageSectionHeader } from "@/components/page-section-header";
import { RoomsTable } from "./rooms-table";

export default function RoomsPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <PageSectionHeader
        title="Phòng học"
        description="Quản lý phòng học và các thông tin liên quan."
      />
      <div className="min-h-[50vh] flex-1 shrink-0">
        <RoomsTable />
      </div>
    </div>
  );
}
