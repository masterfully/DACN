"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, BookOpen, AlertCircle } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { getMySections } from "@/services/section-service";
import type { MySectionListItem } from "@/types/section";
import { usePathname } from "@/i18n/navigation";

export function TeacherClassesSection() {
  const [classes, setClasses] = useState<MySectionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMySections({ limit: 100 });
        setClasses(data.items || []);
      } catch (err) {
        console.error("Failed to fetch teacher classes:", err);
        setError("Không thể tải danh sách lớp học");
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassClick = (sectionId: number) => {
    router.push(`/sections?sectionId=${sectionId}`);
  };

  const isOnSectionsPage = pathname === "/sections";
  const currentSectionId = searchParams.get("sectionId");

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Lớp học</SidebarGroupLabel>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-sidebar-accent rounded p-1 transition-colors"
          aria-label="Toggle classes"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isExpanded ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
      </div>
      {isExpanded && (
        <SidebarGroupContent>
          {isLoading ? (
            <SidebarMenu>
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </SidebarMenu>
          ) : error ? (
            <div className="text-muted-foreground flex items-center gap-2 rounded px-2 py-2 text-xs">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{error}</span>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-muted-foreground px-2 py-4 text-center text-xs">
              Không có lớp học
            </div>
          ) : (
            <SidebarMenu>
              {classes.map((classItem) => {
                const isActive =
                  isOnSectionsPage &&
                  currentSectionId === String(classItem.sectionId);

                return (
                  <SidebarMenuItem key={classItem.sectionId}>
                    <SidebarMenuButton
                      isActive={isActive}
                      size="sm"
                      className="cursor-pointer text-xs"
                      onClick={() => handleClassClick(classItem.sectionId)}
                    >
                      <BookOpen className="h-4 w-4" />
                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate font-medium">
                          {classItem.subjectName}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {classItem.year} ({classItem.enrollmentCount}/
                          {classItem.maxCapacity})
                        </p>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          )}
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}
