import { POST as saveProject } from "../save-table/route";

export async function POST(request: Request) {
  return saveProject(request);
}
