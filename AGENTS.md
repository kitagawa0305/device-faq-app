<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — 에이전트 지침 맵

> 이 파일은 지도입니다. 세부 내용은 `docs/`의 각 파일을 참조하세요.
> 변경 전 반드시 관련 docs 파일을 먼저 읽으세요.

## 프로젝트 개요

**기기 FAQ 도우미** — 전자기기 부품별 FAQ + Claude AI 진단 + 사진 분석 서비스.
스택: Next.js 16 (App Router) · Tailwind CSS 4 · Anthropic SDK (claude-haiku-4-5)

## 아키텍처 빠른 참조

```
데이터 흐름:  devices.json → queryHelper → [FAQ매칭 | 캐시 | API] → UI
의존성 순서:  Types → Data → Lib → API Routes → Components → Pages
```

전체 아키텍처 → [`ARCHITECTURE.md`](./ARCHITECTURE.md)

## 디렉터리 역할

| 경로 | 역할 |
|---|---|
| `data/devices.json` | 기기·부품·FAQ 정적 데이터 (단일 진실 원천) |
| `lib/queryHelper.ts` | FAQ 매칭, 캐시, API 호출 유틸 |
| `lib/diagnosisTypes.ts` | 진단 기능 타입 정의 |
| `hooks/useDiagnosis.ts` | 진단 세션 상태 관리 훅 |
| `components/` | UI 컴포넌트 (서버 상태 없음, props만) |
| `app/api/` | Anthropic API 라우트 (서버 전용) |

## 핵심 제약 (반드시 준수)

- API 키는 `.env.local`에만 — 클라이언트 코드에 절대 노출 금지
- `app/api/` 라우트만 Anthropic SDK 호출 가능
- `devices.json` 스키마 변경 시 `lib/queryHelper.ts` 타입도 동시 수정
- 시스템 프롬프트는 150토큰 이하 유지
- `localStorage` 캐시 TTL: 24시간

보안 정책 전문 → [`docs/SECURITY.md`](./docs/SECURITY.md)

## 코딩 컨벤션

- 컴포넌트: `"use client"` 명시, props 인터페이스 파일 상단 정의
- API 라우트: `NextRequest/NextResponse` 사용, 에러는 `{ error: string }` 형태
- 타입: `interface` 우선, `type`은 유니언·교차 타입에만
- 스타일: Tailwind 클래스만 사용, 인라인 스타일 금지

프론트엔드 전체 컨벤션 → [`docs/FRONTEND.md`](./docs/FRONTEND.md)

## 기능별 문서

| 기능 | 문서 |
|---|---|
| FAQ 매칭 + 캐시 | [`docs/product-specs/faq-matching.md`](./docs/product-specs/faq-matching.md) |
| 사진 분석 (Vision) | [`docs/product-specs/photo-analysis.md`](./docs/product-specs/photo-analysis.md) |
| AI 진단 플로우차트 | [`docs/product-specs/ai-diagnosis.md`](./docs/product-specs/ai-diagnosis.md) |
| 데이터 흐름 설계 | [`docs/design-docs/data-flow.md`](./docs/design-docs/data-flow.md) |

## 로드맵 / 품질 기준

- 다음 작업 → [`docs/PLANS.md`](./docs/PLANS.md)
- 품질 기준 → [`docs/QUALITY_SCORE.md`](./docs/QUALITY_SCORE.md)
- 기술 부채 → [`docs/exec-plans/tech-debt-tracker.md`](./docs/exec-plans/tech-debt-tracker.md)
