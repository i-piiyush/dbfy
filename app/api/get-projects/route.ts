import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/database/mongoDB";
import Field from "@/models/field";
import type { response } from "@/types/response.type";
import dns from "node:dns";

dns.setServers([
  "1.1.1.1",
  "1.0.0.1"
])

function jsonResponse<TData>(body: response<TData>, status: number) {
  return Response.json(body, { status });
}

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

    const projects = await Field.find({ userID: userId })
      .select("projectName tableData createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

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
