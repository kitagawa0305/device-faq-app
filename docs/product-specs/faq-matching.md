# FAQ 매칭 + 캐시

## 기능 설명

사용자 질문을 `devices.json`의 FAQ 키워드와 매칭해 즉시 답변.
미스 시 localStorage 캐시 → Anthropic API 순으로 폴백.

## 매칭 알고리즘

1. 질문을 소문자로 변환
2. 각 FAQ의 `keywords` 배열과 교집합 스코어 계산
3. 최고 스코어 > 0인 FAQ 반환, 동점 시 첫 번째

## 캐시 정책

- 키: `dfaq_{deviceId}_{question.trim().toLowerCase()}`
- TTL: 24시간
- 저장소: `localStorage`
- 용량 초과 시 조용히 무시 (try-catch)

## 답변 출처 배지

| 배지 | 색상 | 조건 |
|---|---|---|
| FAQ | 초록 | 키워드 매칭 성공 |
| 캐시 | 노랑 | localStorage 히트 |
| AI | 파랑 | Anthropic API 호출 |
