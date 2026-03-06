import { fail, ok } from "../../../_mock/response";
import { mockStore } from "../../../_mock/store";

type Params = { params: Promise<{ applicationId: string }> };

export async function GET(_: Request, { params }: Params) {
  const { applicationId } = await params;
  const id = Number(applicationId);
  if (!Number.isFinite(id)) return fail("Invalid applicationId", { status: 400 });

  const app = mockStore.applications.getById(id);
  if (!app) return fail("Application not found", { status: 404, errorCode: "NOT_FOUND" });

  return ok(mockStore.certificates.byApplication(id));
}

