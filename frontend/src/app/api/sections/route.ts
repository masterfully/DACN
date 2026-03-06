import { ok } from "../_mock/response";
import { mockStore } from "../_mock/store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  return ok(mockStore.sections.list(url.searchParams));
}

