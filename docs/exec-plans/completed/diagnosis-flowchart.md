# [완료] AI 진단 플로우차트

**완료일:** 2026-05-13
**회차:** 10회차에 걸쳐 구현

## 구현 내용

- `lib/diagnosisTypes.ts` — 타입 정의
- `app/api/diagnose/route.ts` — Claude Haiku 기반 동적 질문 생성 API
- `hooks/useDiagnosis.ts` — 세션 상태 관리 (최대 6턴, 자동 재시도)
- `components/DiagnosisCard.tsx` — 질문 + 객관식 선택지 UI
- `components/DiagnosisResult.tsx` — 진단 결과 카드
- `components/DiagnosisPanel.tsx` — 전체 진단 흐름 통합
- `app/page.tsx` — 채팅 ↔ 진단 탭 전환

## 결과

부품 클릭 시 자동으로 AI 진단 시작. 최대 6턴 후 원인·수리법·비용·DIY 여부 표시.
