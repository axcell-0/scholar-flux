import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
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

    await dbConnect();

    const habit = await Habit.findOne({
      _id: id,
      userId: payload.userId,
    });

    if (!habit) {
      return NextResponse.json(
        { success: false, message: "Habit not found." },
        { status: 404 }
      );
    }

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const existingLog = await HabitLog.findOne({
      habitId: habit._id,
      userId: payload.userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (existingLog) {
      await HabitLog.findByIdAndDelete(existingLog._id);
      return NextResponse.json(
        { success: true, message: "Habit unchecked for today." },
        { status: 200 }
      );
    }

    await HabitLog.create({
      habitId: habit._id,
      userId: payload.userId,
      date: today,
      completed: true,
    });

    return NextResponse.json(
      { success: true, message: "Habit marked complete for today." },
      { status: 200 }
    );
  } catch (error) {
    console.error("HABIT_TOGGLE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update habit." },
      { status: 500 }
    );
  }
}