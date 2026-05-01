import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
 try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "If this email exists, you will receive a password reset link." },
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;

    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your Scholar Flux password",
      text: `Hi ${user.fullName},\n\nYou have requested to reset your password. Please click the link below to reset it:\n${resetUrl}\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <p>Hi ${user.fullName},</p>
        <p>You have requested to reset your password. Please click the button below to reset it:</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Password reset instructions have been sent to your email." },
      { status: 200 }
    );
 } catch (error) {
    console.error("REQUEST_RESET_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong while requesting the password reset." },
      { status: 500 }
    );
 }
}