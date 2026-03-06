import { fail, ok } from "../../../_mock/response";
import { mockStore } from "../../../_mock/store";

type Params = { params: Promise<{ roomId: string }> };

export async function GET(_: Request, { params }: Params) {
  const { roomId } = await params;
  const id = Number(roomId);
  if (!Number.isFinite(id)) return fail("Invalid roomId", { status: 400 });

  const room = mockStore.rooms.getById(id);
  if (!room) return fail("Room not found", { status: 404, errorCode: "NOT_FOUND" });

  return ok(mockStore.usageHistory.byRoom(id));
}

