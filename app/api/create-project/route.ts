import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/database/mongo-db";
import Project from "@/models/project";
import { jsonResponse } from "@/lib/api-response";
export async function POST(request: Request) {
  try {
    const { userId, isAuthenticated, sessionId } = await auth();
    if (!isAuthenticated || !userId || !sessionId) {
      return jsonResponse<never>(
        { success: false, message: "Sign in to create a project." },
        401,
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse<never>(
        { success: false, message: "The request body must contain valid JSON." },
        400,
      );
    }

    const projectName =
      typeof body === "object" && body !== null && "projectName" in body && typeof body.projectName === "string"
        ? body.projectName.trim()
        : "";

    if (!projectName) {
      return jsonResponse<never>(
        { success: false, message: "Enter a project name." },
        400,
      );
    }
    if (projectName.length > 100) {
      return jsonResponse<never>(
        { success: false, message: "Project names must be 100 characters or fewer." },
        400,
      );
    }

    await connectDB();
    const project = await Project.create({
      projectName,
      tableData: [],
      userID: userId,
    });

    return jsonResponse(
      {
        success: true,
        message: "Project created successfully.",
        data: { id: project._id.toString(), projectName: project.projectName },
      },
      201,
    );
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return jsonResponse<never>(
        { success: false, message: "You already have a project with that name." },
        409,
      );
    }

    console.error("Failed to create project:", error);
    return jsonResponse<never>(
      { success: false, message: "A server error occurred while creating the project." },
      500,
    );
  }
}
