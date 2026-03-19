"use client";

import type { Row } from "@tanstack/react-table";
import { PlusIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import { useCreateRoom, useRoomList, useUpdateRoom } from "@/hooks/use-rooms";
import type { MutationResult } from "@/types/api";
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
  } = useRoomList({ page, limit: pageSize });

  console.log("data", data);

  const { mutateWithResult: createRoom, isLoading: isCreating } =
    useCreateRoom();
  const { mutateWithResult: updateRoom, isLoading: isUpdating } = useUpdateRoom(
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
  ): Promise<MutationResult<Room>> {
    if (mode === "edit") {
      const result = await updateRoom(buildUpdateRoomPayload(values));
      if (result.ok) {
        await refreshRooms();
        setDialogOpen(false);
        setEditingRoom(null);
      }
      return result;
    }

    const result = await createRoom(buildCreateRoomPayload(values));
    if (result.ok) {
      await refreshRooms();
      setDialogOpen(false);
      setEditingRoom(null);
    }
    return result;
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
      // menuActions: [
      //   {
      //     label: `Xóa ${selectedRows.length > 0 ? `${selectedRows.length} phòng` : "phòng"}`,
      //     icon: TrashIcon,
      //     disabled: selectedRows.length === 0,
      //     onClick: () => {
      //       // TODO: gọi API xóa hàng loạt cho selectedRows
      //     },
      //   },
      // ],
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
