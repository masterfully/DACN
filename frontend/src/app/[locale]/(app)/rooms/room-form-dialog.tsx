"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateRoomInput, Room, UpdateRoomInput } from "@/types/room";
import { ROOM_STATUS_OPTIONS } from "./room.constants";

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

export interface RoomFormValues {
  roomName: string;
  roomType: string;
  campus: string;
  capacity: string;
  status: string;
}

export const ROOM_EMPTY_FORM: RoomFormValues = {
  roomName: "",
  roomType: "",
  campus: "",
  capacity: "",
  status: "active",
};

/** Map an existing Room to editable form values. */
export function roomToFormValues(room: Room): RoomFormValues {
  return {
    roomName: room.roomName ?? "",
    roomType: room.roomType ?? "",
    campus: room.campus ?? "",
    capacity: room.capacity != null ? String(room.capacity) : "",
    status: room.status ?? "active",
  };
}

// ---------------------------------------------------------------------------
// Validation + payload mapping
// ---------------------------------------------------------------------------

export interface RoomFormValidationError {
  field: keyof RoomFormValues | "general";
  message: string;
}

export function validateRoomForm(
  values: RoomFormValues,
): RoomFormValidationError | null {
  if (!values.roomName.trim()) {
    return { field: "roomName", message: "Tên phòng không được để trống." };
  }
  if (values.capacity !== "" && Number.isNaN(Number(values.capacity))) {
    return { field: "capacity", message: "Sức chứa phải là số nguyên." };
  }
  return null;
}

export function buildCreateRoomPayload(
  values: RoomFormValues,
): CreateRoomInput {
  return {
    roomName: values.roomName.trim(),
    roomType: values.roomType.trim(),
    campus: values.campus.trim(),
    capacity: values.capacity !== "" ? Number(values.capacity) : 0,
    status: values.status || undefined,
  };
}

export function buildUpdateRoomPayload(
  values: RoomFormValues,
): UpdateRoomInput {
  return {
    roomName: values.roomName.trim(),
    roomType: values.roomType.trim(),
    campus: values.campus.trim(),
    capacity: values.capacity !== "" ? Number(values.capacity) : 0,
    status: values.status || undefined,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface RoomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the dialog is in "edit" mode; otherwise "create" mode. */
  editingRoom: Room | null;
  onSubmit: (
    values: RoomFormValues,
    mode: "create" | "edit",
  ) => Promise<boolean>;
  isSubmitting?: boolean;
}

export function RoomFormDialog({
  open,
  onOpenChange,
  editingRoom,
  onSubmit,
  isSubmitting = false,
}: RoomFormDialogProps) {
  const [values, setValues] = React.useState<RoomFormValues>(ROOM_EMPTY_FORM);
  const [error, setError] = React.useState<string | null>(null);

  // Sync form values whenever the dialog opens or the target room changes.
  React.useEffect(() => {
    if (open) {
      setValues(editingRoom ? roomToFormValues(editingRoom) : ROOM_EMPTY_FORM);
      setError(null);
    }
  }, [open, editingRoom]);

  function handleFieldChange(field: keyof RoomFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validateRoomForm(values);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    const mode = editingRoom ? "edit" : "create";
    const ok = await onSubmit(values, mode);
    if (!ok) {
      setError(
        mode === "edit"
          ? "Cập nhật phòng thất bại. Vui lòng thử lại."
          : "Thêm phòng thất bại. Vui lòng thử lại.",
      );
    }
  }

  const isEditing = editingRoom !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Cập nhật phòng học" : "Thêm phòng học mới"}
          </DialogTitle>
        </DialogHeader>

        <form id="room-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="roomName">Tên phòng</Label>
            <Input
              id="roomName"
              placeholder="VD: P.101"
              value={values.roomName}
              onChange={(e) => handleFieldChange("roomName", e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="roomType">Loại phòng</Label>
            <Input
              id="roomType"
              placeholder="VD: Lý thuyết, Thực hành, Hội trường"
              value={values.roomType}
              onChange={(e) => handleFieldChange("roomType", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="campus">Cơ sở</Label>
            <Input
              id="campus"
              placeholder="VD: Cơ sở 1"
              value={values.campus}
              onChange={(e) => handleFieldChange("campus", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="capacity">Sức chứa</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              placeholder="VD: 40"
              value={values.capacity}
              onChange={(e) => handleFieldChange("capacity", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="status">Trạng thái</Label>
            <select
              id="status"
              value={values.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              disabled={isSubmitting}
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ROOM_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button type="submit" form="room-form" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu…" : isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
