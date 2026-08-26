import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { coverLetter, jobId } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        suggestion: "To use real AI feedback, please add GROQ_API_KEY to your .env file. " +
          "However, I suggest focusing your proposal on your relevant experience, setting clear milestones, " +
          "and offering a frequent communication cadence."
      });
    }

    const prompt = `
You are an expert freelance career coach. Your task is to provide constructive feedback or a better version of the following freelance proposal cover letter. 
If the user provided a very short sentence, expand it into a professional, compelling cover letter (around 100-150 words).
If the user provided a full cover letter, provide 2 sentences of actionable advice to make it more persuasive.

User's draft:
"${coverLetter}"

${jobId ? `Job ID Context: ${jobId}` : ""}

Return ONLY the suggested text or feedback, nothing else. Do not use markdown blocks unless necessary.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: [{ role: "user", content: prompt }],
      })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || "Groq API error");
    }

    const text = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ suggestion: text });
  } catch (error) {
    console.error("AI Feedback Error:", error);
    return NextResponse.json(
      { error: `Failed to generate AI feedback. ${error instanceof Error ? error.message : ""}` },
      { status: 500 }
    );
  }
}
