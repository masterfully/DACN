"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteRoom } from "@/hooks/use-rooms";
import type { Room } from "@/types/room";

interface RoomRowActionsProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDeleteSuccess?: () => void;
}

export function RoomRowActions({
  room,
  onEdit,
  onDeleteSuccess,
}: RoomRowActionsProps) {
  const { mutateWithResult: deleteRoom, isLoading } = useDeleteRoom(room.roomId);

  async function handleDelete() {
    const result = await deleteRoom();
    if (result.ok) {
      await onDeleteSuccess?.();
    }
  }

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading}>
            <TrashIcon className="size-4" />
            Xóa
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa phòng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa phòng{" "}
              <span className="text-foreground font-medium">
                {room.roomName ?? `#${room.roomId}`}
              </span>
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isLoading}
              onClick={handleDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button variant="ghost" aria-label="Sửa" onClick={() => onEdit(room)}>
        <PencilIcon className="size-4" />
        Sửa
      </Button>
    </div>
  );
}
