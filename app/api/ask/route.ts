import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  "당신은 전자기기 수리 전문가입니다. 기기 부품 문제를 간결하고 실용적으로 한국어로 답변하세요.";

export async function POST(req: NextRequest) {
  const { question, deviceName, componentName } = await req.json();

  if (!question) {
    return NextResponse.json({ error: "질문이 없습니다" }, { status: 400 });
  }

  const userMessage = componentName
    ? `[${deviceName} / ${componentName}] ${question}`
    : `[${deviceName}] ${question}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ answer: text, source: "api" });
}
