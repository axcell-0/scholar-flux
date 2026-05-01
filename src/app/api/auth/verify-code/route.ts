import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

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

        const user = await User.findOne({ email: email.toLowerCase() }).select(
            "+emailVerificationCode +emailVerificationCodeExpires"
        );

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        if (user.emailVerified) {
            return NextResponse.json(
                { success: true, message: "Email already verified." },
                { status: 200 }
            );
        }

        if (!user.emailVerificationCode || !user.emailVerificationCodeExpires) {
            return NextResponse.json(
                { success: false, message: "No active verification code. Please sign up again." },
                { status: 400 }
            );
        }


        const now = new Date();

        if (!user.emailVerificationCodeExpires) {
            return NextResponse.json(
                { success: false, message: "No expiration set." },
                { status: 400 }
            );
        }

        const expires = new Date(user.emailVerificationCodeExpires);

        if (expires < now) {
            return NextResponse.json(
                { success: false, message: "Verification code has expired. Please sign up again." },
                { status: 400 }
            );
        }

        if (user.emailVerificationCode !== code) {
            return NextResponse.json(
                { success: false, message: "Invalid verification code." },
                { status: 400 }
            );
        }

        // Code is correct and not expired
        user.emailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationCodeExpires = undefined;

        await user.save();

        return NextResponse.json(
            { success: true, message: "Email verified." },
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