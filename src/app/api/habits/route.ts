import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { verifyAuthToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    const habits = await Habit.find({ userId: payload.userId })
      .sort({ createdAt: 1 })
      .lean();

    const habitIds = habits.map((h) => h._id);

    if (habitIds.length === 0) {
      return NextResponse.json(
        { success: true, habits: [] },
        { status: 200 }
      );
    }

    const logs = await HabitLog.find({
      userId: payload.userId,
      habitId: { $in: habitIds },
    })
      .sort({ date: -1 })
      .lean();

    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10); // YYYY-MM-DD

    const logsByHabit = new Map<string, any[]>();
    logs.forEach((log) => {
      const key = log.habitId.toString();
      if (!logsByHabit.has(key)) logsByHabit.set(key, []);
      logsByHabit.get(key)!.push(log);
    });

    const result = habits.map((habit) => {
      const hLogs = logsByHabit.get(habit._id.toString()) || [];

      let completedToday = false;
      let streak = 0;

      if (hLogs.length > 0) {
        const dates = hLogs
          .filter((l) => l.completed)
          .map((l) => l.date)
          .sort((a, b) => b.getTime() - a.getTime());

        let currentDate = new Date(todayKey);
        for (const date of dates) {
          const dateKey = date.toISOString().slice(0, 10);
          const curKey = currentDate.toISOString().slice(0, 10);

          if (dateKey === curKey) {
            if (dateKey === todayKey) completedToday = true;
            streak += 1;
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (date < currentDate) {
            break;
          }
        }
      }

      return {
        id: habit._id.toString(),
        name: habit.name,
        targetFrequency: habit.targetFrequency,
        completedToday,
        streak,
      };
    });

    return NextResponse.json(
      { success: true, habits: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("HABITS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch habits." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, targetFrequency } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Habit name is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const habit = await Habit.create({
      userId: payload.userId,
      name,
      targetFrequency: targetFrequency || "daily",
    });

    return NextResponse.json(
      { success: true, message: "Habit created.", habit },
      { status: 201 }
    );
  } catch (error) {
    console.error("HABITS_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create habit." },
      { status: 500 }
    );
  }
}