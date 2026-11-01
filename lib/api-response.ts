import type { ApiResponse } from "@/types/api-response";

/** Keeps API payloads and status codes consistent across route handlers. */
export function jsonResponse<TData>(body: ApiResponse<TData>, status = 200) {
  return Response.json(body, { status });
}
