import { fail, ok } from "../_mock/response";
import { mockStore } from "../_mock/store";
import type { ProfileApplication } from "@/types";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<ProfileApplication> | null;
  if (!body) return fail("Invalid JSON body", { status: 400 });

  const created = mockStore.applications.submit(body);
  return ok(created, { status: 201 });
}

