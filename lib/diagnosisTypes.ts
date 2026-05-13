// ────────────────────────────────────────────
// 1. 선택지 & 질문 (Claude가 매 턴 반환)
// ────────────────────────────────────────────

export interface DiagnosisOption {
  label: string;   // 선택지 텍스트
  hint?: string;   // 부가 설명 (선택)
}

export interface DiagnosisQuestion {
  question: string;
  options: DiagnosisOption[];
}

// ────────────────────────────────────────────
// 2. 사용자 답변 히스토리 (매 턴 누적)
// ────────────────────────────────────────────

export interface DiagnosisAnswer {
  turnIndex: number;
  question: string;
  selectedLabel: string;
}

// ────────────────────────────────────────────
// 3. 최종 진단 결과
// ────────────────────────────────────────────

export type DiagnosisUrgency = "즉시 수리" | "수리 권장" | "선택적 수리";

export interface DiagnosisResult {
  cause: string;          // 문제 원인 요약
  conclusion: string;     // 한 줄 결론
  repairSteps: string[];  // 수리 단계 (순서 있음)
  estimatedCost: string;  // 예상 비용
  canDIY: boolean;        // DIY 가능 여부
  urgency: DiagnosisUrgency;
}

// ────────────────────────────────────────────
// 4. API 요청 / 응답 스키마
// ────────────────────────────────────────────

export interface DiagnosisRequest {
  deviceName: string;
  componentName: string;
  componentDescription: string;
  history: DiagnosisAnswer[];  // 빈 배열이면 첫 번째 질문 생성
}

// 진단 진행 중
interface DiagnosisResponseContinue {
  isDone: false;
  question: DiagnosisQuestion;
}

// 진단 완료
interface DiagnosisResponseDone {
  isDone: true;
  result: DiagnosisResult;
}

export type DiagnosisAPIResponse =
  | DiagnosisResponseContinue
  | DiagnosisResponseDone;

// ────────────────────────────────────────────
// 5. 클라이언트 세션 상태
// ────────────────────────────────────────────

export type DiagnosisStatus =
  | "idle"        // 시작 전
  | "questioning" // 질문 진행 중
  | "loading"     // API 응답 대기 중
  | "done"        // 진단 완료
  | "error";      // 오류 발생

export interface DiagnosisSession {
  deviceId: string;
  deviceName: string;
  componentId: string;
  componentName: string;
  componentDescription: string;
  history: DiagnosisAnswer[];
  currentQuestion: DiagnosisQuestion | null;
  result: DiagnosisResult | null;
  status: DiagnosisStatus;
  turnCount: number;  // 최대 6턴 제한
}

// ────────────────────────────────────────────
// 6. 세션 초기값 생성 헬퍼
// ────────────────────────────────────────────

export function createSession(
  deviceId: string,
  deviceName: string,
  componentId: string,
  componentName: string,
  componentDescription: string
): DiagnosisSession {
  return {
    deviceId,
    deviceName,
    componentId,
    componentName,
    componentDescription,
    history: [],
    currentQuestion: null,
    result: null,
    status: "idle",
    turnCount: 0,
  };
}
