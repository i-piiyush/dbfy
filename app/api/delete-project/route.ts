import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/database/mongo-db";
import Project from "@/models/project";
import { jsonResponse } from "@/lib/api-response";
import { deleteProjectSchema } from "@/lib/validation/project.schema";

export async function DELETE(request: Request) {
  try {
    const { userId, isAuthenticated, sessionId } = await auth();
    if (!isAuthenticated || !userId || !sessionId) {
      return jsonResponse<never>({ success: false, message: "Sign in to delete a project." }, 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse<never>({ success: false, message: "The request body must contain valid JSON." }, 400);
    }

    const validation = deleteProjectSchema.safeParse(body);
    if (!validation.success) {
      return jsonResponse<never>({
        success: false,
        message: "Project deletion validation failed.",
        errors: validation.error.issues.map((issue) => issue.message),
      }, 400);
    }

    await connectDB();
    const deletedProject = await Project.findOneAndDelete({
      _id: validation.data.projectId,
      userID: userId,
    }).select("_id projectName").lean();

    if (!deletedProject) {
      return jsonResponse<never>({ success: false, message: "Project not found." }, 404);
    }

    return jsonResponse({
      success: true,
      message: `Project "${deletedProject.projectName}" deleted successfully.`,
      data: { id: deletedProject._id.toString() },
    }, 200);
  } catch (error) {
    console.error("Failed to delete project:", error);
    return jsonResponse<never>({ success: false, message: "A server error occurred while deleting the project." }, 500);
  }
}
