
import connectDB from "@/lib/database/mongoDB";
import { NextResponse } from "next/server";

export const GET = async () => {



  
  try {
    await connectDB()
    console.log("working db")

   
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("error fetching user! ", errorMessage);
    return NextResponse.json(
      { success: false, message: "server error" },
      { status: 500 },
    );
  }
};