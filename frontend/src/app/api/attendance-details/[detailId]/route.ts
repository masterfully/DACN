import { fail, ok } from "../../_mock/response";
import { mockStore } from "../../_mock/store";

type Params = { params: Promise<{ detailId: string }> };

type PatchBody = { Status?: unknown };

export async function PATCH(req: Request, { params }: Params) {
  const { detailId } = await params;
  const id = Number(detailId);
  if (!Number.isFinite(id)) return fail("Invalid detailId", { status: 400 });

  const body = (await req.json().catch(() => null)) as PatchBody | null;
  const status = typeof body?.Status === "string" ? body.Status : null;
  if (!status) return fail("Invalid body. Expected { Status: string }", { status: 400 });

  const updated = mockStore.attendance.updateDetailStatus(id, status);
  if (!updated) return fail("Attendance detail not found", { status: 404, errorCode: "NOT_FOUND" });

  return ok(updated);
}

