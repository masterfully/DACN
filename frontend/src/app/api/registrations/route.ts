import { fail, ok } from "../_mock/response";
import { mockStore } from "../_mock/store";

type RegistrationBody = {
  SectionID?: unknown;
  StudentID?: unknown;
};

function parseIds(body: RegistrationBody | null) {
  const sectionId = Number((body as RegistrationBody | null)?.SectionID);
  const studentId = Number((body as RegistrationBody | null)?.StudentID);
  if (!Number.isFinite(sectionId) || !Number.isFinite(studentId)) return null;
  return { sectionId, studentId };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RegistrationBody | null;
  const ids = parseIds(body);
  if (!ids) return fail("Invalid body. Expected { SectionID, StudentID }", { status: 400 });

  const created = mockStore.registrations.register(ids.sectionId, ids.studentId);
  if (!created) return fail("Already registered", { status: 409, errorCode: "ALREADY_EXISTS" });

  return ok(created, { status: 201 });
}

export async function DELETE(req: Request) {
  const body = (await req.json().catch(() => null)) as RegistrationBody | null;
  const ids = parseIds(body);
  if (!ids) return fail("Invalid body. Expected { SectionID, StudentID }", { status: 400 });

  const removed = mockStore.registrations.unregister(ids.sectionId, ids.studentId);
  if (!removed) return fail("Registration not found", { status: 404, errorCode: "NOT_FOUND" });

  return ok({ SectionID: ids.sectionId, StudentID: ids.studentId });
}

