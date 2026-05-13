# AI 진단 플로우차트 설계

## 설계 결정

**동적 생성 방식 채택** (정적 트리 대신)

- Claude Haiku가 이전 답변을 보고 다음 질문을 생성
- 같은 부품이라도 답변에 따라 다른 진단 경로 생성
- 정적 트리 대비: 데이터 유지보수 불필요, 경우의 수 제한 없음

**트레이드오프**

| 항목 | 동적 | 정적 트리 |
|---|---|---|
| 유연성 | ✅ 높음 | ❌ 낮음 |
| 비용 | ❌ 매 턴 API 호출 | ✅ 무료 |
| 일관성 | ❌ 매번 다를 수 있음 | ✅ 항상 동일 |
| 유지보수 | ✅ 불필요 | ❌ JSON 관리 필요 |

## API 응답 스키마

```typescript
// 진행 중
{ isDone: false, question: { question: string, options: DiagnosisOption[] } }

// 완료
{ isDone: true, result: { cause, conclusion, repairSteps[], estimatedCost, canDIY, urgency } }
```

## 턴 제한 로직

- 최대 6턴
- 6턴 도달 시 히스토리에 `__force_done__` 신호 추가
- 실패 시 자동 1회 재시도 후 error 상태
