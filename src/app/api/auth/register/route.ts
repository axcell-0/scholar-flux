// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
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

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "This email is already registered." },
        { status: 409 }
      );
    }
    // 1) hash the password
    const saltROunds = 10;
    const passwordHash = await bcrypt.hash(password, saltROunds);

    // 2) generate email verification 6-digits code
    const emailVerificationCode = crypto.randomInt(100000, 999999).toString();

    const emailVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

    // 3) create user with passwordHash (NOT password)
   const user = new User({
  fullName,
  email: email.toLowerCase(),
  passwordHash: passwordHash,
  emailVerified: false,
  emailVerificationCode: emailVerificationCode,
  emailVerificationCodeExpires: emailVerificationCodeExpires,
});
await user.save();

    // 4) send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${emailVerificationCode}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your Scholar Flux account",
      text: `Hi ${user.fullName},\n\nYour verification code is: ${emailVerificationCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't sign up, you can ignore this email.`,
      html: `
        <p>Hi ${user.fullName},</p>
        <p>Thanks for signing up for <strong>Scholar Flux</strong>.</p>
        <p  style="display:inline-block;padding:10px 16px;border-radius:8px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">
         Your verification code is: <strong>${emailVerificationCode}</strong>
        </p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't sign up, you can ignore this email.</p>
        <p>Or copy and paste this code:</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Account created. Please enter the verification code sent to your email." },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { success: false, message: "Failed to create account." },
      { status: 500 }
    );
  }
}