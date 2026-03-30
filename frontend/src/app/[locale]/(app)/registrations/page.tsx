import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RegistrationsTable } from "./registrations-table";

export default function RegistrationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Đăng ký học phần
      </h1>
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[min(24rem,50vh)] w-full rounded-md" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
        }
      >
        <RegistrationsTable />
      </Suspense>
    </div>
  );
}
