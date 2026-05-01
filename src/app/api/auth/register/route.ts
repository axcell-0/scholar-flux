import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import { sendEmail } from "@/lib/email";

type RegisterBody = {
  fullName: string;
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password } = (await req.json()) as RegisterBody;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase();

    // 1) If a verified user already exists, block
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "This email is already registered." },
        { status: 409 }
      );
    }

    // 2) Create or update pending signup
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const pending = await PendingUser.findOneAndUpdate(
      { email: normalizedEmail },
      {
        fullName,
        email: normalizedEmail,
        passwordHash,
        verificationCode,
        expiresAt,
      },
      { upsert: true, new: true }
    );

    // 3) Send code by email
    await sendEmail({
      to: pending.email,
      subject: "Your Scholar Flux verification code",
      text: `Hi ${pending.fullName},\n\nYour Scholar Flux verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't sign up, you can ignore this email.`,
      html: `
        <p>Hi ${pending.fullName},</p>
        <p>Welcome to <strong>Scholar Flux</strong>.</p>
        <p>Your verification code is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">
          ${verificationCode}
        </p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't sign up, you can ignore this email.</p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "We sent you a 6-digit code. Please check your email.",
        email: pending.email,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { success: false, message: "Failed to create account." },
      { status: 500 }
    );
  }
}