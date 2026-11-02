import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/database/mongo-db";
import Project from "@/models/project";
import { jsonResponse } from "@/lib/api-response";
import type { ProjectSummary } from "@/types/project";

import dns from "node:dns";

dns.setServers([
  "1.1.1.1",
  "1.0.0.1"
]);


export async function GET() {
  try {
    const { userId, isAuthenticated } = await auth();

    if (!isAuthenticated || !userId) {
      return jsonResponse<never>(
        { success: false, message: "You must be signed in to view your projects." },
        401,
      );
    }

    await connectDB();

    const projects = await Project.aggregate<ProjectSummary>([
      { $match: { userID: userId } },
      { $sort: { updatedAt: -1 } },
      {
        $project: {
          _id: 1,
          projectName: 1,
          createdAt: 1,
          updatedAt: 1,
          tableCount: { $size: { $ifNull: ["$tableData", []] } },
        },
      },
    ]);
    return jsonResponse(
      {
        success: true,
        message: "Projects loaded successfully.",
        data: projects,
      },
      200,
    );
  } catch (error) {
    console.error("Failed to load projects:", error);
    return jsonResponse<never>(
      { success: false, message: "A server error occurred while loading your projects." },
      500,
    );
  }
}
