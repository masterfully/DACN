"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Room } from "@/types/room";
import { ROOM_STATUS_LABELS, ROOM_TYPE_LABELS } from "./room.constants";

interface RoomDetailSheetProps {
  room: Room | null;
  onClose: () => void;
}

export function RoomDetailSheet({ room, onClose }: RoomDetailSheetProps) {
  return (
    <Sheet
      open={room !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Chi tiết phòng — {room?.roomName ?? ""}</SheetTitle>
        </SheetHeader>

        {room && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
            <dt className="text-muted-foreground font-medium">Mã phòng</dt>
            <dd>{room.roomId}</dd>

            <dt className="text-muted-foreground font-medium">Tên phòng</dt>
            <dd>{room.roomName}</dd>

            <dt className="text-muted-foreground font-medium">Loại phòng</dt>
            <dd>
              {room.roomType
                ? (ROOM_TYPE_LABELS[room.roomType] ?? room.roomType)
                : "—"}
            </dd>

            <dt className="text-muted-foreground font-medium">Cơ sở</dt>
            <dd>{room.campus ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Sức chứa</dt>
            <dd>{room.capacity != null ? `${room.capacity} chỗ` : "—"}</dd>

            <dt className="text-muted-foreground font-medium">Trạng thái</dt>
            <dd>
              {room.status
                ? (ROOM_STATUS_LABELS[room.status] ?? room.status)
                : "—"}
            </dd>
          </dl>
        )}
      </SheetContent>
    </Sheet>
  );
}
