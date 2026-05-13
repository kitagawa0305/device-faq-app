# AI 진단 플로우차트

## 기능 설명

부품 클릭 시 Claude Haiku가 최대 6턴의 객관식 질문으로 문제를 진단하고 수리 방법·비용을 안내합니다.

## UX 흐름

1. 사용자가 SVG 부품 클릭
2. 오른쪽 패널이 자동으로 "AI 진단" 탭으로 전환
3. Claude가 첫 질문 생성 (3~4개 선택지)
4. 사용자 선택 → 다음 질문
5. 최대 6턴 후 최종 결과 카드 표시

## 결과 카드 항목

- 긴급도 (즉시 수리 / 수리 권장 / 선택적 수리)
- 한 줄 결론
- 문제 원인 (2~3문장)
- 수리 단계 (번호 순서)
- 예상 비용
- DIY 가능 여부

## 관련 파일

| 파일 | 역할 |
|---|---|
| `lib/diagnosisTypes.ts` | 타입 정의 |
| `hooks/useDiagnosis.ts` | 세션 상태 관리 |
| `app/api/diagnose/route.ts` | Claude API 호출 |
| `components/DiagnosisPanel.tsx` | 전체 패널 |
| `components/DiagnosisCard.tsx` | 질문 + 선택지 UI |
| `components/DiagnosisResult.tsx` | 결과 카드 UI |
