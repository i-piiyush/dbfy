import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/database/mongo-db";
import { saveTableSchema } from "@/lib/validation/save-project.schema";
import Project from "@/models/project";
import { jsonResponse } from "@/lib/api-response";
const MAX_REQUEST_BYTES = 1_000_000;
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export async function POST(request: Request) {
  try {
    const { userId, isAuthenticated, sessionId } = await auth();
    if (!isAuthenticated || !userId || !sessionId) {
      return jsonResponse<never>({ success: false, message: "You must be signed in to save a project." }, 401);
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return jsonResponse<never>({ success: false, message: "The project data is too large to save." }, 413);
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_REQUEST_BYTES) {
      return jsonResponse<never>({ success: false, message: "The project data is too large to save." }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonResponse<never>({ success: false, message: "The request body must contain valid JSON." }, 400);
    }

    const validation = saveTableSchema.safeParse(body);
    if (!validation.success) {
      return jsonResponse<never>({
        success: false,
        message: "Project validation failed. Fix the listed issues and try again.",
        errors: validation.error.issues.map((issue) => {
          const path = issue.path.join(".");
          return path ? `${path}: ${issue.message}` : issue.message;
        }),
      }, 400);
    }

    await connectDB();
    const projectFilter = { _id: validation.data.projectId, userID: userId };
    const existingProject = await Project.findOne(projectFilter).select("projectName tableData").lean();

    if (!existingProject) {
      return jsonResponse<never>({
        success: false,
        message: "Project not found.",
      }, 404);
    }

    if (canonicalJson(existingProject.tableData) === canonicalJson(validation.data.tableData)) {
      return jsonResponse<never>(
        { success: false, message: "There are no changes to save." },
        409,
      );
    }

    const savedProject = await Project.findOneAndUpdate(
      projectFilter,
      { $set: { tableData: validation.data.tableData } },
      { returnDocument: "after", runValidators: true },
    ).select("projectName tableData").lean();

    if (!savedProject) {
      return jsonResponse<never>(
        { success: false, message: "Project not found." },
        404,
      );
    }

    return jsonResponse({
      success: true,
      message: `Project "${savedProject.projectName}" saved successfully.`,
      data: {
        projectName: savedProject.projectName,
        tableCount: savedProject.tableData.length,
      },
    }, 200);
  } catch (error) {
    console.error("Failed to save project tables:", error);
    return jsonResponse<never>({
      success: false,
      message: "A server error occurred while saving the project. Please try again.",
    }, 500);
  }
}
