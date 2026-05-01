import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and code are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase();

    // 1) Check if user already exists & verified
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: true, message: "Email already verified. You can log in." },
        { status: 200 }
      );
    }

    // 2) Look up pending signup
    const pending = await PendingUser.findOne({ email: normalizedEmail });

    if (!pending) {
      return NextResponse.json(
        {
          success: false,
          message: "No pending signup found. Please sign up again.",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    if (pending.expireAt < now) {
      // expired; clean up
      await PendingUser.deleteOne({ _id: pending._id });
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired. Please sign up again.",
        },
        { status: 400 }
      );
    }

    if (pending.verificationCode !== code) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: 400 }
      );
    }

    // 3) Code is valid → create real user
    const user = await User.create({
      fullName: pending.fullName,
      email: pending.email,
      passwordHash: pending.passwordHash,
      emailVerified: true,
    });

    // 4) Delete pending signup
    await PendingUser.deleteOne({ _id: pending._id });

    return NextResponse.json(
      { success: true, message: "Email verified. You can now log in." },
      { status: 200 }
    );
  } catch (err) {
    console.error("VERIFY_CODE_ERROR", err);
    return NextResponse.json(
      { success: false, message: "Failed to verify code." },
      { status: 500 }
    );
  }
}