import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  "당신은 전자기기 수리 전문가입니다. 사용자가 업로드한 기기 사진을 분석하여 다음을 한국어로 답변하세요:\n1. 보이는 손상/이상 부위\n2. 예상 원인\n3. 권장 조치 (DIY 가능 여부 포함)\n4. 주의사항\n간결하고 실용적으로 답변하세요.";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  const deviceName = (formData.get("deviceName") as string) ?? "전자기기";
  const componentName = formData.get("componentName") as string | null;

  if (!file) {
    return NextResponse.json({ error: "이미지가 없습니다" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "JPEG, PNG, GIF, WebP 형식만 지원합니다" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mediaType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

  const context = componentName
    ? `기기: ${deviceName}, 부품: ${componentName}`
    : `기기: ${deviceName}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: `[${context}] 이 사진에서 보이는 문제를 분석해주세요.`,
          },
        ],
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ answer: text, source: "photo" });
}
