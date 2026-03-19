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
import { getApiFormErrorMessage, mapApiFieldErrors } from "@/lib/api-error";
import type { MutationResult } from "@/types/api";
import type {
  CreateRoomInput,
  Room,
  RoomStatus,
  RoomType,
  UpdateRoomInput,
} from "@/types/room";
import { ROOM_STATUS_OPTIONS, ROOM_TYPE_OPTIONS } from "./room.constants";

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

export interface RoomFormValues {
  roomName: string;
  roomType: RoomType;
  campus: string;
  capacity: string;
  status: RoomStatus;
}

export const ROOM_EMPTY_FORM: RoomFormValues = {
  roomName: "",
  roomType: "LECTURE",
  campus: "",
  capacity: "",
  status: "ACTIVE",
};

/** Map an existing Room to editable form values. */
export function roomToFormValues(room: Room): RoomFormValues {
  return {
    roomName: room.roomName ?? "",
    roomType: room.roomType ?? "LECTURE",
    campus: room.campus ?? "",
    capacity: room.capacity != null ? String(room.capacity) : "",
    status: room.status ?? "ACTIVE",
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
  if (!values.roomType) {
    return { field: "roomType", message: "Loại phòng không được để trống." };
  }
  if (!values.campus.trim()) {
    return { field: "campus", message: "Cơ sở không được để trống." };
  }
  if (values.capacity !== "" && Number.isNaN(Number(values.capacity))) {
    return { field: "capacity", message: "Sức chứa phải là số nguyên." };
  }
  if (values.capacity === "" || Number(values.capacity) <= 0) {
    return { field: "capacity", message: "Sức chứa phải lớn hơn 0." };
  }
  return null;
}

export function buildCreateRoomPayload(
  values: RoomFormValues,
): CreateRoomInput {
  return {
    roomName: values.roomName.trim(),
    roomType: values.roomType,
    campus: values.campus.trim(),
    capacity: Number(values.capacity),
    status: values.status,
  };
}

export function buildUpdateRoomPayload(
  values: RoomFormValues,
): UpdateRoomInput {
  return {
    roomName: values.roomName.trim(),
    roomType: values.roomType,
    campus: values.campus.trim(),
    capacity: Number(values.capacity),
    status: values.status,
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
  ) => Promise<MutationResult<Room>>;
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
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<keyof RoomFormValues, string>>
  >({});

  // Sync form values whenever the dialog opens or the target room changes.
  React.useEffect(() => {
    if (open) {
      setValues(editingRoom ? roomToFormValues(editingRoom) : ROOM_EMPTY_FORM);
      setError(null);
      setFieldErrors({});
    }
  }, [open, editingRoom]);

  function handleFieldChange(field: keyof RoomFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validationError = validateRoomForm(values);
    if (validationError) {
      if (validationError.field === "general") {
        setError(validationError.message);
      } else {
        setFieldErrors({ [validationError.field]: validationError.message });
      }
      return;
    }

    const mode = editingRoom ? "edit" : "create";
    const result = await onSubmit(values, mode);
    if (!result.ok) {
      setFieldErrors(
        mapApiFieldErrors<keyof RoomFormValues>(result.error, {
          roomName: "roomName",
          roomType: "roomType",
          campus: "campus",
          capacity: "capacity",
          status: "status",
        }),
      );
      setError(
        getApiFormErrorMessage(
          result.error,
          mode === "edit"
            ? "Cập nhật phòng thất bại. Vui lòng thử lại."
            : "Thêm phòng thất bại. Vui lòng thử lại.",
        ),
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
            {fieldErrors.roomName ? (
              <p className="text-destructive text-sm">{fieldErrors.roomName}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="roomType">Loại phòng</Label>
            <select
              id="roomType"
              value={values.roomType}
              onChange={(e) =>
                handleFieldChange("roomType", e.target.value as RoomType)
              }
              disabled={isSubmitting}
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ROOM_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.roomType ? (
              <p className="text-destructive text-sm">{fieldErrors.roomType}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="campus">Cơ sở</Label>
            <Input
              id="campus"
              placeholder="VD: Cơ sở 1"
              value={values.campus}
              onChange={(e) => handleFieldChange("campus", e.target.value)}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.campus ? (
              <p className="text-destructive text-sm">{fieldErrors.campus}</p>
            ) : null}
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
            {fieldErrors.capacity ? (
              <p className="text-destructive text-sm">{fieldErrors.capacity}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="status">Trạng thái</Label>
            <select
              id="status"
              value={values.status}
              onChange={(e) =>
                handleFieldChange("status", e.target.value as RoomStatus)
              }
              disabled={isSubmitting}
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ROOM_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.status ? (
              <p className="text-destructive text-sm">{fieldErrors.status}</p>
            ) : null}
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
