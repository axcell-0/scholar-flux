
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyAuthToken } from "@/lib/auth";

async function getUserIdFromRequest(){
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = verifyAuthToken(token);
  return payload?.userId || null;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.error("TASKS_GET: no token cookie");
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const payload = verifyAuthToken(token);

    if (!payload) {
      console.error("TASKS_GET: invalid token");
      return NextResponse.json(
        { success: false, message: "Invalid token." },
        { status: 401 }
      );
    }

    await dbConnect();

    const tasks = await Task.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        tasks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("TASKS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tasks." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.error("TASKS_POST: no token cookie");
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const payload = verifyAuthToken(token);

    if (!payload) {
      console.error("TASKS_POST: invalid token");
      return NextResponse.json(
        { success: false, message: "Invalid token." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, course, dueDate, priority } = body;

    if (!title || !course || !dueDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, course, and due date are required.",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const task = await Task.create({
      userId: payload.userId,
      title,
      course,
      // make sure dueDate is valid in production too
      dueDate: new Date(dueDate),
      priority: priority || "medium",
      status: "pending",
    });

    return NextResponse.json(
      { success: true, message: "Task created.", task },
      { status: 201 }
    );
  } catch (error) {
    console.error("TASKS_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create task." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, title, course, dueDate, priority, status } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Task id is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(title !== undefined && { title }),
        ...(course !== undefined && { course }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
        ...(priority !== undefined && { priority }),
        ...(status !== undefined && { status }),
      },
      { new: true }
    );

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Task updated.", task },
      { status: 200 }
    );
  } catch (error) {
    console.error("TASKS_PUT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update task." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Task id is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const deleted = await Task.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Task deleted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("TASKS_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete task." },
      { status: 500 }
    );
  }
}