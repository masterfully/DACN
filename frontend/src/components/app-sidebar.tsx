"use client";

import { LayoutDashboard, Users, BookOpen, Building2, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

function useLocaleBasePath() {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/");
  const locale = segments[1] || "";
  return locale ? `/${locale}` : "";
}

export function AppSidebar() {
  const pathname = usePathname() || "";
  const base = useLocaleBasePath();

  const mainItems: NavItem[] = [
    { href: `${base}/dashboard`, label: "Tổng quan", icon: LayoutDashboard },
  ];

  const managementItems: NavItem[] = [
    { href: `${base}/students`, label: "Sinh viên", icon: Users },
    { href: `${base}/subjects`, label: "Môn học", icon: BookOpen },
    { href: `${base}/rooms`, label: "Phòng học", icon: Building2 },
    { href: `${base}/attendance`, label: "Điểm danh", icon: ClipboardList },
  ];

  const renderItem = (item: NavItem) => {
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link href={item.href}>
            <Icon />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-semibold uppercase">
            AP
          </div>
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-medium">Academic Portal</span>
            <span className="text-xs text-muted-foreground">
              Quản lý đào tạo
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{mainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{managementItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

