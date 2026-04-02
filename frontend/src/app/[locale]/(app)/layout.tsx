import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { RequireAuth } from "@/components/require-auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <SidebarProvider>
      <RequireAuth locale={locale}>
        <AppSidebar />
        <SidebarInset>
          <AppTopbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex flex-1 flex-col gap-4 p-4 outline-none"
          >
            {children}
          </main>
        </SidebarInset>
      </RequireAuth>
    </SidebarProvider>
  );
}
