import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyAuthToken } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const payload = verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { status } = body as { status?: string };

    await dbConnect();

    const task = await Task.findOne({
      _id: id,
      userId: payload.userId,
    });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    if (status && ["pending", "in-progress", "completed"].includes(status)) {
      task.status = status as any;
    } else {
      task.status = "completed";
    }

    await task.save();

    return NextResponse.json(
      { success: true, message: "Task updated.", task },
      { status: 200 }
    );
  } catch (error) {
    console.error("TASK_PATCH_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update task." },
      { status: 500 }
    );
  }
}