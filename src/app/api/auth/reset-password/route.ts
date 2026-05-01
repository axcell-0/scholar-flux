import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Missing token or password." },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // token not expired
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json(
      { success: true, message: "Password updated." },
      { status: 200 }
    );
  } catch (err) {
    console.error("RESET_PASSWORD_ERROR", err);
    return NextResponse.json(
      { success: false, message: "Failed to reset password." },
      { status: 500 }
    );
  }
}