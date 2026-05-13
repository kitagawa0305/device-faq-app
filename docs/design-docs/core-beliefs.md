# 핵심 설계 원칙 (Core Beliefs)

## 1. FAQ 우선, API는 마지막

정적 FAQ가 존재하면 API를 호출하지 않는다.
순서: FAQ 매칭 → 캐시 → API 호출.
**이유:** 비용 절감 + 응답 속도 향상.

## 2. 서버에서만 API 키 사용

Anthropic API 키는 `app/api/` 라우트 내부에서만 접근한다.
클라이언트 번들에 포함되면 안 된다.

## 3. 단일 진실 원천 (Single Source of Truth)

기기·부품·FAQ 데이터는 `data/devices.json` 하나에만 존재한다.
컴포넌트 내부에 하드코딩 금지.

## 4. 타입이 문서다

`lib/queryHelper.ts`와 `lib/diagnosisTypes.ts`의 인터페이스가
데이터 계약의 공식 명세다. 타입 변경 없이 동작을 바꾸지 않는다.

## 5. 진단은 최대 6턴

AI 진단은 최대 6턴으로 제한한다.
**이유:** 비용 통제 + 사용자 경험 (너무 길면 이탈).

## 6. 캐시는 24시간

같은 질문에 대한 API 응답은 24시간 localStorage에 캐시한다.
**이유:** 반복 질문 비용 제거.
