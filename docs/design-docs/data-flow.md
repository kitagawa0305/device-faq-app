# 데이터 흐름 설계

## 질문 처리 파이프라인

```
사용자 입력 (ChatPanel)
  │
  ▼
queryHelper.askQuestion(question, device, component)
  │
  ├─① matchFaq(question, faqs)
  │     keywords 배열과 질문 텍스트 교집합 스코어링
  │     score > 0 → { answer, source: "faq" } 즉시 반환
  │
  ├─② getCached(cacheKey)
  │     key: `dfaq_{deviceId}_{question.toLowerCase()}`
  │     TTL 24h 초과 시 자동 삭제
  │     hit → { answer, source: "cache" } 즉시 반환
  │
  └─③ POST /api/ask
        body: { question, deviceName, componentName }
        응답 → setCached() 저장
        → { answer, source: "api" } 반환
```

## 진단 데이터 흐름

```
useDiagnosis.startDiagnosis(device, component)
  │
  └─ POST /api/diagnose { history: [] }
       │
       └─ Claude 응답 { isDone: false, question: {...} }
            │
            ▼
       사용자 선택지 클릭
            │
            └─ POST /api/diagnose { history: [answer1] }
                 │
                 └─ ... (최대 6턴)
                      │
                      └─ Claude 응답 { isDone: true, result: {...} }
                           │
                           └─ localStorage 저장 (key: diag_{deviceId}_{componentId})
```

## localStorage 키 규칙

| 접두사 | 용도 | 예시 키 |
|---|---|---|
| `dfaq_` | FAQ 캐시 | `dfaq_smartphone_배터리가 빨리 닳아요` |
| `diag_` | 진단 결과 | `diag_smartphone_battery` |
