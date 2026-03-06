import { fail, ok } from "../../_mock/response";
import { mockStore } from "../../_mock/store";

type Params = { params: Promise<{ id: string }> };

type PatchBody = {
  ApplicationStatus?: unknown;
  ReviewNotes?: unknown;
};

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const applicationId = Number(id);
  if (!Number.isFinite(applicationId)) return fail("Invalid application id", { status: 400 });

  const body = (await req.json().catch(() => null)) as PatchBody | null;
  const status = typeof body?.ApplicationStatus === "string" ? body.ApplicationStatus : null;
  const notes = typeof body?.ReviewNotes === "string" ? body.ReviewNotes : "";
  if (!status) {
    return fail("Invalid body. Expected { ApplicationStatus: string, ReviewNotes?: string }", {
      status: 400,
    });
  }

  const updated = mockStore.applications.review(applicationId, status, notes);
  if (!updated) return fail("Application not found", { status: 404, errorCode: "NOT_FOUND" });

  return ok(updated);
}

