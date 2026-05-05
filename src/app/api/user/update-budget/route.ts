import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Convert to number explicitly to be safe
    const amount = Number(body.amount);

    if (isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const payload = verifyAuthToken(token);

    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $set: { monthlyBudget: amount } }, // Use $set to be explicit
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Database updated to:", updatedUser.monthlyBudget); // Check your terminal!

    return NextResponse.json({ success: true, budget: updatedUser.monthlyBudget });
  } catch (error) {
    console.error("Budget Update Error:", error);
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
  }
}