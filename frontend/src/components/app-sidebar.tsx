"use client";

import {
  BadgeCheck,
  Book,
  BookOpen,
  Building,
  Calendar,
  Check,
  ClipboardList,
  FileText,
  GraduationCap,
  Key,
  NotebookPen,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
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
import { usePathname } from "@/i18n/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export function AppSidebar() {
  const pathname = usePathname() || "";

  const accountAndApplicationItems: NavItem[] = [
    { href: `/lecturers`, label: "Giảng viên", icon: GraduationCap },
    { href: `/students`, label: "Sinh viên", icon: Users },
    { href: `/accounts`, label: "Tài khoản", icon: Key },
    { href: `/roles`, label: "Phân quyền", icon: Shield },
  ];

  const sectionItems: NavItem[] = [
    { href: `/subjects`, label: "Môn học", icon: Book },
    { href: `/sections`, label: "Học phần", icon: BookOpen },
    { href: `/registrations`, label: "Đăng ký học phần", icon: NotebookPen },
  ];

  const admissionItems: NavItem[] = [
    { href: `/approvals`, label: "Xét duyệt hồ sơ", icon: Check },
    { href: `/applications`, label: "Hồ sơ đăng ký", icon: FileText },
    { href: `/certificates`, label: "Chứng chỉ", icon: BadgeCheck },
  ];

  const facilityItems: NavItem[] = [
    { href: `/rooms`, label: "Phòng học", icon: Building },
  ];

  const attendanceAndScheduleItems: NavItem[] = [
    { href: `/attendance`, label: "Điểm danh", icon: ClipboardList },
    { href: `/schedules`, label: "Lịch học", icon: Calendar },
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
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-semibold uppercase">
              AP
            </div>
            <div className="flex flex-col text-sm leading-tight">
              <span className="font-medium">Academic Portal</span>
              <span className="text-muted-foreground text-xs">
                Quản lý đào tạo
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hồ sơ & Tài khoản</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountAndApplicationItems.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Học phần</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{sectionItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tuyển sinh </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{admissionItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Cơ sở vật chất</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{facilityItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Điểm danh & Lịch học</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {attendanceAndScheduleItems.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
