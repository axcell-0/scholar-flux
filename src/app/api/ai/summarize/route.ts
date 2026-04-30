import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing 'content' in request body" },
        { status: 400 }
      );
    }

    // ✅ Correct model usage
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
You are a helpful study assistant for university students.

Summarize this study note:
1) Start with a very short simple explanation (2–3 sentences).
2) Then list 3–5 bullet key points.

Note:
${content}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (err: any) {
    console.error("Gemini summarize error:", err);

    if (err.status === 429 || err.code === 429) {
      return NextResponse.json(
        {
          error:
            "Gemini free API limit reached for today. Please try again later.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}