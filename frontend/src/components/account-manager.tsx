"use client";

import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import { AccountsTable } from "@/app/[locale]/(app)/accounts/accounts-table";

export function AccountManager() {
  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Tài khoản"
          description="Quản lý tài khoản và các thông tin liên quan."
        />
      }
    >
      <AccountsTable />
    </PageContainer>
  );
}
