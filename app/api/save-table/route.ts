import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/database/mongoDB";
import { saveTableSchema } from "@/lib/validation/saveTable.schema";
import Field from "@/models/field";
import type { response } from "@/types/response.type";

import dns from "node:dns";

dns.setServers([
  "1.1.1.1",
  "1.0.0.1"
]);

const MAX_REQUEST_BYTES = 1_000_000;

function jsonResponse<TData>(body: response<TData>, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  try {
    const { userId, isAuthenticated } = await auth();
    if (!isAuthenticated || !userId) {
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
    await Field.init();
    const indexes = await Field.collection.indexes();
    const legacyUserIndex = indexes.find((index) =>
      index.unique === true &&
      index.key.userID === 1 &&
      !("projectName" in index.key),
    );
    if (legacyUserIndex?.name) {
      try {
        await Field.collection.dropIndex(legacyUserIndex.name);
      } catch (error) {
        // Another simultaneous save may have already removed this legacy index.
        if (!(typeof error === "object" && error !== null && "code" in error && error.code === 27)) {
          throw error;
        }
      }
    }

    const savedProject = await Field.findOneAndUpdate(
      { userID: userId, projectName: validation.data.projectName },
      { $set: { tableData: validation.data.tableData, projectName: validation.data.projectName } },
      { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true },
    ).select("projectName tableData").lean();

    if (!savedProject) {
      return jsonResponse<never>({
        success: false,
        message: "The project could not be saved. Please try again.",
      }, 500);
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
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return jsonResponse<never>({
        success: false,
        message: "A project with that name was saved at the same time. Please try saving again.",
      }, 409);
    }
    return jsonResponse<never>({
      success: false,
      message: "A server error occurred while saving the project. Please try again.",
    }, 500);
  }
}
