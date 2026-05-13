import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  DiagnosisRequest,
  DiagnosisAPIResponse,
} from "@/lib/diagnosisTypes";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `당신은 전자기기 수리 전문가입니다. 사용자의 기기 증상을 단계별로 진단합니다.

## 규칙
- 매 턴 하나의 질문과 3~4개의 선택지를 제시하세요.
- 이전 답변을 반드시 참고해서 다음 질문을 좁혀가세요.
- 최대 6턴 안에 진단을 완료하세요.
- 충분한 정보가 모이면 isDone: true로 최종 결과를 반환하세요.

## 응답 형식 (반드시 JSON만 반환)

진단 진행 중:
{
  "isDone": false,
  "question": {
    "question": "질문 텍스트",
    "options": [
      { "label": "선택지 텍스트", "hint": "부가 설명(선택)" },
      { "label": "선택지 텍스트" }
    ]
  }
}

진단 완료 (충분한 정보가 모였을 때):
{
  "isDone": true,
  "result": {
    "cause": "문제 원인 (2~3문장)",
    "conclusion": "한 줄 결론",
    "repairSteps": ["1단계", "2단계", "3단계"],
    "estimatedCost": "예상 비용 범위",
    "canDIY": true or false,
    "urgency": "즉시 수리" or "수리 권장" or "선택적 수리"
  }
}

JSON 외 다른 텍스트는 절대 포함하지 마세요.`;

export async function POST(req: NextRequest) {
  const body: DiagnosisRequest = await req.json();
  const { deviceName, componentName, componentDescription, history } = body;

  // 히스토리를 대화 메시지로 변환
  const messages: Anthropic.MessageParam[] = [];

  // 첫 턴: 기기 정보 제공
  messages.push({
    role: "user",
    content: `기기: ${deviceName}\n부품: ${componentName}\n부품 설명: ${componentDescription}\n\n이 부품에 문제가 생긴 것 같습니다. 진단을 시작해주세요.`,
  });

  // 히스토리가 있으면 이전 대화 재구성
  for (const answer of history) {
    // Claude 이전 질문 (assistant)
    messages.push({
      role: "assistant",
      content: JSON.stringify({
        isDone: false,
        question: { question: answer.question, options: [] },
      }),
    });
    // 사용자 답변 (user)
    messages.push({
      role: "user",
      content: answer.selectedLabel,
    });
  }

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
    messages,
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  // JSON 파싱
  let parsed: DiagnosisAPIResponse;
  try {
    // 마크다운 코드블록 제거 (Claude가 간혹 ```json ... ``` 감쌀 때)
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "응답 파싱 실패", raw },
      { status: 500 }
    );
  }

  return NextResponse.json(parsed);
}
