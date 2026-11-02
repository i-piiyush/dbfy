import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/database/mongo-db";
import Project from "@/models/project";
import { jsonResponse } from "@/lib/api-response";
import { renameProjectSchema } from "@/lib/validation/project.schema";

export async function PATCH(request: Request) {
  try {
    const { userId, isAuthenticated, sessionId } = await auth();
    if (!isAuthenticated || !userId || !sessionId) {
      return jsonResponse<never>({ success: false, message: "Sign in to rename a project." }, 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse<never>({ success: false, message: "The request body must contain valid JSON." }, 400);
    }

    const validation = renameProjectSchema.safeParse(body);
    if (!validation.success) {
      return jsonResponse<never>({
        success: false,
        message: "Project rename validation failed.",
        errors: validation.error.issues.map((issue) => issue.message),
      }, 400);
    }

    await connectDB();
    const project = await Project.findOne({ _id: validation.data.projectId, userID: userId });
    if (!project) {
      return jsonResponse<never>({ success: false, message: "Project not found." }, 404);
    }

    const normalizedName = validation.data.projectName.toLocaleLowerCase();
    const projects = await Project.find({ userID: userId }).select("_id projectName").lean();
    const duplicate = projects.some((candidate) =>
      candidate._id.toString() !== project._id.toString() &&
      candidate.projectName.trim().toLocaleLowerCase() === normalizedName,
    );
    if (duplicate) {
      return jsonResponse<never>({ success: false, message: "You already have a project with that name." }, 409);
    }

    if (project.projectName !== validation.data.projectName) {
      project.projectName = validation.data.projectName;
      await project.save();
    }

    return jsonResponse({
      success: true,
      message: "Project renamed successfully.",
      data: {
        id: project._id.toString(),
        projectName: project.projectName,
        updatedAt: project.updatedAt,
      },
    }, 200);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return jsonResponse<never>({ success: false, message: "You already have a project with that name." }, 409);
    }
    console.error("Failed to rename project:", error);
    return jsonResponse<never>({ success: false, message: "A server error occurred while renaming the project." }, 500);
  }
}
