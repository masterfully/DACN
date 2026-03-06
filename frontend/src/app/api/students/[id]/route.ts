import { fail, ok } from "../../_mock/response";
import { mockStore } from "../../_mock/store";
import type { Student } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const studentId = Number(id);
  if (!Number.isFinite(studentId)) return fail("Invalid student id", { status: 400 });

  const student = mockStore.students.getById(studentId);
  if (!student) return fail("Student not found", { status: 404, errorCode: "NOT_FOUND" });

  return ok(student);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const studentId = Number(id);
  if (!Number.isFinite(studentId)) return fail("Invalid student id", { status: 400 });

  const patch = (await req.json().catch(() => null)) as Partial<Student> | null;
  if (!patch) return fail("Invalid JSON body", { status: 400 });

  const updated = mockStore.students.update(studentId, patch);
  if (!updated) return fail("Student not found", { status: 404, errorCode: "NOT_FOUND" });

  return ok(updated);
}

