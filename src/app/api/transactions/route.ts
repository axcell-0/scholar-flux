import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
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

    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month"); // e.g. 2026-04
    const category = searchParams.get("category");

    await dbConnect();

    const query: any = { userId: payload.userId };

    if (monthParam) {
      const [year, month] = monthParam.split("-").map(Number);
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      query.date = { $gte: start, $lt: end };
    }

    if (category) {
      query.category = category;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(
      { success: true, transactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("TRANSACTIONS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions." },
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
    const { amount, type, category, date, note } = body;

    if (!amount || !type || !category || !date) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount, type, category, and date are required.",
        },
        { status: 400 }
      );
    }

    if (!["income", "expense"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid transaction type." },
        { status: 400 }
      );
    }

    await dbConnect();

    const tx = await Transaction.create({
      userId: payload.userId,
      amount: Number(amount),
      type,
      category,
      date: new Date(date),
      note: note || "",
    });

    return NextResponse.json(
      { success: true, message: "Transaction created.", transaction: tx },
      { status: 201 }
    );
  } catch (error) {
    console.error("TRANSACTIONS_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create transaction." },
      { status: 500 }
    );
  }
}