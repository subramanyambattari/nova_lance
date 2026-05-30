import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Assuming GEMINI_API_KEY is available in the environment
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { coverLetter, jobId } = await req.json();

    if (!apiKey) {
      // Fallback for development if API key isn't provided
      return NextResponse.json({
        suggestion: "To use real AI feedback, please add GEMINI_API_KEY to your .env file. " +
          "However, I suggest focusing your proposal on your relevant experience, setting clear milestones, " +
          "and offering a frequent communication cadence."
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert freelance career coach. Your task is to provide constructive feedback or a better version of the following freelance proposal cover letter. 
If the user provided a very short sentence, expand it into a professional, compelling cover letter (around 100-150 words).
If the user provided a full cover letter, provide 2 sentences of actionable advice to make it more persuasive.

User's draft:
"${coverLetter}"

${jobId ? `Job ID Context: ${jobId}` : ""}

Return ONLY the suggested text or feedback, nothing else. Do not use markdown blocks unless necessary.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ suggestion: text });
  } catch (error) {
    console.error("AI Feedback Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI feedback." },
      { status: 500 }
    );
  }
}
