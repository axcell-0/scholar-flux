import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Note from "@/models/Note";
import { verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function getUserIdFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload) return null;

  return payload.userId;
}

export async function GET() {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    await dbConnect();

    const notes = await Note.find({ userId })
      .sort({ pinned: -1, updatedAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        notes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("NOTES_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notes." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, course, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and content are required.",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const note = await Note.create({
      userId,
      title,
      course,
      content,
    });

    return NextResponse.json(
      {
        success: true,
        note,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("NOTES_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create note." },
      { status: 500 }
    );
  }
}

// ✅ UPDATE existing note
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, course, content } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Note id is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(title !== undefined && { title }),
        ...(course !== undefined && { course }),
        ...(content !== undefined && { content }),
      },
      { new: true }
    ).lean();

    if (!note) {
      return NextResponse.json(
        { success: false, message: "Note not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Note updated.", note },
      { status: 200 }
    );
  } catch (error) {
    console.error("NOTES_PUT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update note." },
      { status: 500 }
    );
  }
}

// ✅ DELETE existing note
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Note id is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const deleted = await Note.findOneAndDelete({ _id: id, userId }).lean();

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Note not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Note deleted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("NOTES_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete note." },
      { status: 500 }
    );
  }
}