import { ok } from "../_mock/response";
import { mockStore } from "../_mock/store";

export async function GET() {
  return ok(mockStore.rooms.list());
}

