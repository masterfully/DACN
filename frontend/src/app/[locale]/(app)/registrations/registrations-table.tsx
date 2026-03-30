"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  BookOpenCheckIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { ColHeader, DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCancelRegistration,
  useMyRegistrations,
  useRegisterSection,
} from "@/hooks/use-registrations";
import { useSectionList } from "@/hooks/use-sections";
import type { MyRegistration } from "@/types/registration";
import type { SectionListItem } from "@/types/section";

function RegisterToggleCell({
  section,
  isRegistered,
  onAfterChanged,
}: {
  section: SectionListItem;
  isRegistered: boolean;
  onAfterChanged: () => Promise<void>;
}) {
  const { mutateWithResult: registerSection, isLoading: isRegistering } =
    useRegisterSection();
  const { mutateWithResult: cancelRegistration, isLoading: isCancelling } =
    useCancelRegistration(section.sectionId);

  const isFull = section.enrollmentCount >= section.maxCapacity;
  const isDisabled = (isFull && !isRegistered) || isRegistering || isCancelling;

  async function handleToggle() {
    const result = isRegistered
      ? await cancelRegistration(undefined)
      : await registerSection({ sectionId: section.sectionId });

    if (!result.ok) {
      toast.error(
        result.error?.message ?? "Không thể cập nhật đăng ký học phần.",
      );
      return;
    }

    toast.success(
      isRegistered
        ? "Hủy đăng ký học phần thành công."
        : "Đăng ký học phần thành công.",
    );
    await onAfterChanged();
  }

  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        className="cursor-pointer"
        checked={isRegistered}
        disabled={isDisabled}
        onChange={() => {
          void handleToggle();
        }}
        aria-label={
          isRegistered ? "Hủy đăng ký học phần này" : "Đăng ký học phần này"
        }
      />
    </div>
  );
}

function RegisteredRowActions({
  registration,
  onAfterChanged,
}: {
  registration: MyRegistration;
  onAfterChanged: () => Promise<void>;
}) {
  const { mutateWithResult: cancelRegistration, isLoading } =
    useCancelRegistration(registration.sectionId);

  async function handleCancel() {
    const result = await cancelRegistration(undefined);

    if (!result.ok) {
      toast.error(result.error?.message ?? "Không thể hủy đăng ký học phần.");
      return;
    }

    toast.success("Hủy đăng ký học phần thành công.");
    await onAfterChanged();
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={isLoading}
      onClick={() => {
        void handleCancel();
      }}
    >
      <TrashIcon className="size-4" /> Hủy
    </Button>
  );
}

export function RegistrationsTable() {
  const [openPage, setOpenPage] = React.useState(1);
  const [openPageSize, setOpenPageSize] = React.useState(10);
  const [openSearch, setOpenSearch] = React.useState("");

  const {
    data: openSections,
    isLoading: isOpenLoading,
    error: openError,
    mutate: refreshOpenSections,
  } = useSectionList({
    page: openPage,
    limit: openPageSize,
    search: openSearch.trim() || undefined,
    status: 0,
    visibility: 1,
  });

  const {
    data: myRegistrations,
    isLoading: isMyLoading,
    error: myError,
    mutate: refreshMyRegistrations,
  } = useMyRegistrations({
    page: 1,
    limit: 50,
  });

  const registeredSectionIds = React.useMemo(
    () => new Set((myRegistrations?.items ?? []).map((item) => item.sectionId)),
    [myRegistrations?.items],
  );

  const refreshAfterMutation = React.useCallback(async () => {
    await Promise.all([refreshMyRegistrations(), refreshOpenSections()]);
  }, [refreshMyRegistrations, refreshOpenSections]);

  const openSectionColumns = React.useMemo<ColumnDef<SectionListItem>[]>(
    () => [
      {
        id: "__registration_toggle__",
        header: () => <ColHeader label="Đăng ký" center />,
        cell: ({ row }) => (
          <RegisterToggleCell
            section={row.original}
            isRegistered={registeredSectionIds.has(row.original.sectionId)}
            onAfterChanged={refreshAfterMutation}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 70,
      },
      {
        accessorKey: "sectionId",
        header: () => <ColHeader center label="Mã học phần" />,
        meta: { visibilityLabel: "Mã học phần" },
        cell: ({ row }) => (
          <div className="text-center">{row.original.sectionId}</div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "enrollmentCount",
        header: () => <ColHeader center icon={UsersIcon} label="Còn lại" />,
        meta: { visibilityLabel: "Còn lại" },
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.maxCapacity - row.original.enrollmentCount}
          </div>
        ),
      },
      {
        accessorKey: "subjectName",
        header: () => <ColHeader icon={BookOpenCheckIcon} label="Môn học" />,
        meta: { visibilityLabel: "Môn học" },
        enableSorting: false,
      },
      {
        accessorKey: "lecturerName",
        header: () => <ColHeader icon={UserIcon} label="Giảng viên" />,
        meta: { visibilityLabel: "Giảng viên" },
        enableSorting: false,
      },
      // {
      //   accessorKey: "year",
      //   header: () => <ColHeader icon={SchoolIcon} label="Năm học" />,
      //   meta: { visibilityLabel: "Năm học" },
      //   enableSorting: false,
      // },
    ],
    [registeredSectionIds, refreshAfterMutation],
  );

  const myItems = myRegistrations?.items ?? [];
  const myMeta = myRegistrations?.meta;
  const myTotal = myMeta?.total ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-6">
      <section className="min-h-0 flex-1 space-y-3">
        {/* <h2 className="text-lg font-semibold">Học phần đang mở</h2> */}
        <DataTable<SectionListItem>
          columns={openSectionColumns}
          data={openSections?.items ?? []}
          pagination={{
            page: openSections?.meta.page ?? openPage,
            pageSize: openSections?.meta.limit ?? openPageSize,
            total: openSections?.meta.total ?? 0,
          }}
          onPaginationChange={(page, pageSize) => {
            setOpenPage(page);
            setOpenPageSize(pageSize);
          }}
          isLoading={isOpenLoading}
          error={openError?.message ?? null}
          getRowId={(row) => String(row.sectionId)}
          enableColumnVisibility
          searchValue={openSearch}
          onSearch={(value) => {
            setOpenSearch(value);
            setOpenPage(1);
          }}
          searchPlaceholder="Tìm theo tên môn học..."
          messages={{ empty: "Không có học phần đang mở." }}
        />
      </section>

      <section className="mt-auto shrink-0 space-y-3">
        <h2 className="text-lg font-semibold">Học phần đã đăng ký</h2>
        <div className="flex h-[320px] flex-col rounded-md border">
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-muted sticky top-0">
                <TableRow>
                  <TableHead className="w-[130px] text-center">
                    Mã học phần
                  </TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead>Giảng viên</TableHead>
                  {/* <TableHead className="w-[120px] text-center">Năm học</TableHead> */}
                  <TableHead className="w-[120px] text-center">Hủy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isMyLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : myError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-destructive h-24 text-center"
                    >
                      {myError.message}
                    </TableCell>
                  </TableRow>
                ) : myItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground h-24 text-center"
                    >
                      Bạn chưa đăng ký học phần nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  myItems.map((registration) => (
                    <TableRow key={registration.sectionId}>
                      <TableCell className="text-center">
                        {registration.sectionId}
                      </TableCell>
                      <TableCell>{registration.subjectName}</TableCell>
                      <TableCell>{registration.lecturerName}</TableCell>
                      {/* <TableCell className="text-center">{registration.year}</TableCell> */}
                      <TableCell>
                        <div className="flex justify-center">
                          <RegisteredRowActions
                            registration={registration}
                            onAfterChanged={refreshAfterMutation}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-3 py-2">
            <p className="text-muted-foreground text-sm">
              Tổng {myTotal} học phần đã đăng ký
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
