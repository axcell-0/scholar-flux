import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserIdFromToken } from "@/lib/auth";

/**
 * Helper: Get authenticated user ID from token
 */
async function getAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies(); // sync in route handlers
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return getUserIdFromToken(token);
  } catch {
    return null;
  }
}

/**
 * Helper: Format user response
 */
function formatUser(user: any) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    department: user.department || "",
    level: user.level || "",
    createdAt: user.createdAt,
  };
}

/**
 * GET: Fetch user profile
 */
export async function GET() {
  try {
    await dbConnect();

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select(
      "fullName email department level createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(formatUser(user));
  } catch (error) {
    console.error("PROFILE_GET_ERROR", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, department, level } = body;

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (department !== undefined) updateData.department = department;
    if (level !== undefined) updateData.level = level;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("fullName email department level createdAt");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(formatUser(user));
  } catch (error) {
    console.error("PROFILE_PUT_ERROR", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}