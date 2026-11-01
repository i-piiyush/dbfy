import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import connectDB from "@/lib/database/mongo-db";
import Project from "@/models/project";
import { jsonResponse } from "@/lib/api-response";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Clerk validates the session cookie or bearer token and provides the
    // authenticated user's ID. Require an active user session for this route.
    const { userId, isAuthenticated, sessionId } = await auth();
    if (!isAuthenticated || !userId || !sessionId) {
      return jsonResponse<never>(
        { success: false, message: "You must be signed in with an active session to fetch this project." },
        401,
      );
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return jsonResponse<never>(
        { success: false, message: "The project ID is invalid." },
        400,
      );
    }

    await connectDB();

    // Include the owner in the query so IDs cannot be used to access another
    // user's saved project.
    const project = await Project.findOne({ _id: id, userID: userId })
      .select("projectName tableData createdAt updatedAt")
      .lean();

    if (!project) {
      return jsonResponse<never>(
        { success: false, message: "Project not found." },
        404,
      );
    }

    return jsonResponse(
      {
        success: true,
        message: "Project loaded successfully.",
        data: project,
      },
      200,
    );
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return jsonResponse<never>(
      { success: false, message: "A server error occurred while fetching the project." },
      500,
    );
  }
}
