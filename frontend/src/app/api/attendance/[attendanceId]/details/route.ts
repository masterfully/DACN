import { fail, ok } from "../../../_mock/response";
import { mockStore } from "../../../_mock/store";

type Params = { params: Promise<{ attendanceId: string }> };

export async function GET(_: Request, { params }: Params) {
  const { attendanceId } = await params;
  const id = Number(attendanceId);
  if (!Number.isFinite(id)) return fail("Invalid attendanceId", { status: 400 });

  return ok(mockStore.attendance.details(id));
}

