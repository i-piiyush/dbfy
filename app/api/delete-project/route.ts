import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import connectDB from "@/lib/database/mongoDB";
import Field from "@/models/field";
import type { response } from "@/types/response.type";

const deleteProjectSchema = z.object({
  projectId: z.string().regex(/^[a-f\d]{24}$/i, "Project ID must be valid."),
}).strict();

function jsonResponse<TData>(body: response<TData>, status: number) {
  return Response.json(body, { status });
}

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
    const deletedProject = await Field.findOneAndDelete({
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
