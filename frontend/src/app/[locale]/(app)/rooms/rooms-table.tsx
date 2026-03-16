"use client";

import type { Row } from "@tanstack/react-table";
import { PlusIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import { useCreateRoom, useRoomList, useUpdateRoom } from "@/hooks/use-rooms";
import type { Room } from "@/types/room";
import { roomColumns } from "./columns";
import { RoomDetailSheet } from "./room-detail-sheet";
import {
  buildCreateRoomPayload,
  buildUpdateRoomPayload,
  RoomFormDialog,
  type RoomFormValues,
} from "./room-form-dialog";
import { RoomRowActions } from "./room-row-actions";

// ---------------------------------------------------------------------------
// Mock data — chỉ dùng để test hiển thị, xóa khi kết nối API thật
// ---------------------------------------------------------------------------
const MOCK_ROOMS: Room[] = Array.from({ length: 100 }, (_, i) => ({
  roomId: i + 100,
  roomName: `P.${100 + i + 1}`,
  roomType: ["Lý thuyết", "Thực hành", "Hội trường"][i % 3],
  campus: ["Cơ sở 1", "Cơ sở 2"][i % 2],
  capacity: [30, 40, 50, 80, 120][i % 5],
  status: ["active", "inactive", "maintenance"][i % 3],
}));

function useMockRoomList(page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const items = MOCK_ROOMS.slice(start, start + pageSize);
  return {
    data: { items, meta: { page, limit: pageSize, total: MOCK_ROOMS.length } },
    isLoading: false,
    error: {
      message: null,
    },
    mutate: () => {
      return {
        data: {
          items,
          meta: { page, limit: pageSize, total: MOCK_ROOMS.length },
        },
        isLoading: false,
        error: undefined,
      };
    },
  };
}
// ---------------------------------------------------------------------------
export function RoomsTable() {
  // Pagination
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Detail sheet
  const [detailRoom, setDetailRoom] = React.useState<Room | null>(null);

  // Create / edit dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingRoom, setEditingRoom] = React.useState<Room | null>(null);

  const {
    data,
    isLoading,
    error,
    mutate: refreshRooms,
  } = useMockRoomList(page, pageSize);

  const { mutate: createRoom, isLoading: isCreating } = useCreateRoom();
  const { mutate: updateRoom, isLoading: isUpdating } = useUpdateRoom(
    editingRoom?.roomId ?? 0,
  );
  const isSubmitting = isCreating || isUpdating;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function openAddDialog() {
    setEditingRoom(null);
    setDialogOpen(true);
  }

  function openEditDialog(room: Room) {
    setEditingRoom(room);
    setDialogOpen(true);
  }

  async function handleFormSubmit(
    values: RoomFormValues,
    mode: "create" | "edit",
  ): Promise<boolean> {
    if (mode === "edit") {
      const ok = await updateRoom(buildUpdateRoomPayload(values));
      if (ok) refreshRooms();
      return !!ok;
    }

    const ok = await createRoom(buildCreateRoomPayload(values));
    if (ok) refreshRooms();
    return !!ok;
  }

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
  }

  function handleRowDoubleClick(row: Row<Room>) {
    setDetailRoom(row.original);
  }

  function buildToolbarActions(selectedRows: Row<Room>[]): ToolbarActionGroup {
    return {
      primary: {
        label: "Thêm mới",
        icon: PlusIcon,
        variant: "outline",
        onClick: openAddDialog,
      },
      menuActions: [
        {
          label: `Xóa ${selectedRows.length > 0 ? `${selectedRows.length} phòng` : "phòng"}`,
          icon: TrashIcon,
          disabled: selectedRows.length === 0,
          onClick: () => {
            // TODO: gọi API xóa hàng loạt cho selectedRows
          },
        },
      ],
    };
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <DataTable<Room>
        columns={roomColumns}
        data={data?.items ?? []}
        pagination={{
          page: data?.meta.page ?? 1,
          pageSize: data?.meta.limit ?? 10,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.roomId)}
        enableRowSelection
        enableColumnVisibility
        toolbarActions={buildToolbarActions}
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <RoomRowActions
            room={row.original}
            onEdit={openEditDialog}
            onDeleteSuccess={refreshRooms}
          />
        )}
      />

      <RoomFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingRoom={editingRoom}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <RoomDetailSheet room={detailRoom} onClose={() => setDetailRoom(null)} />
    </>
  );
}
