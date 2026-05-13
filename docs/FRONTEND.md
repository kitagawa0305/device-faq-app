# FRONTEND.md — 프론트엔드 컨벤션

## 컴포넌트 규칙

- 클라이언트 컴포넌트는 파일 상단에 `"use client"` 명시
- props 인터페이스는 파일 상단, 컴포넌트 함수 위에 선언
- 컴포넌트 내부에서 직접 fetch 금지 — 반드시 props 또는 hooks 경유

## 스타일링

- Tailwind CSS 클래스만 사용
- 인라인 스타일(`style={{}}`) 금지
- 다크 테마 고정 (`bg-gray-900`, `bg-gray-950` 계열)
- 색상 의미 체계:
  - 파랑(`blue`) → 일반 AI 응답, 사용자 버블
  - 초록(`emerald`) → FAQ / DIY 가능 / 선택적 수리
  - 노랑(`amber`) → 캐시 / 전문가 권장
  - 빨강(`red`) → 전문가 필요 / 즉시 수리
  - 보라(`indigo/purple`) → AI 진단 / 사진 분석

## 상태 관리

- 전역 상태 없음 (Context, Zustand 사용 금지)
- 상태는 `app/page.tsx`에서 관리 후 props로 전달
- 진단 세션 상태는 `hooks/useDiagnosis.ts`에 캡슐화

## 파일 네이밍

- 컴포넌트: `PascalCase.tsx`
- 훅: `useCamelCase.ts`
- 유틸: `camelCase.ts`
- 타입 파일: `camelCaseTypes.ts`
