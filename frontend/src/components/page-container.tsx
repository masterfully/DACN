import type { ReactNode } from "react";

interface PageContainerProps {
  header: ReactNode;
  children: ReactNode;
}

export function PageContainer({ header, children }: PageContainerProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      {header}
      <div className="min-h-[50vh] flex-1 shrink-0">{children}</div>
    </div>
  );
}
