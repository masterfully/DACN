import { fail, ok } from "../../../_mock/response";
import { mockStore } from "../../../_mock/store";

type Params = { params: Promise<{ sectionId: string }> };

export async function GET(_: Request, { params }: Params) {
  const { sectionId } = await params;
  const id = Number(sectionId);
  if (!Number.isFinite(id)) return fail("Invalid sectionId", { status: 400 });

  const section = mockStore.sections.getById(id);
  if (!section) return fail("Section not found", { status: 404, errorCode: "NOT_FOUND" });

  return ok(mockStore.schedules.bySection(id));
}

