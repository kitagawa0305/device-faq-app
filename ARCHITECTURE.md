# ARCHITECTURE.md

## 시스템 개요

전자기기 부품별 FAQ + AI 진단 + 사진 분석 서비스.
사용자가 기기 부품을 클릭하면 FAQ 또는 AI 진단 흐름으로 안내합니다.

## 레이어 의존성

```
Types (lib/diagnosisTypes.ts, lib/queryHelper.ts 인터페이스)
  ↓
Data (data/devices.json)
  ↓
Lib (lib/queryHelper.ts — 매칭·캐시·fetch)
  ↓
API Routes (app/api/ask · app/api/diagnose · app/api/analyze-photo)
  ↓
Hooks (hooks/useDiagnosis.ts)
  ↓
Components (Sidebar · DeviceDiagram · ChatPanel · DiagnosisPanel · ...)
  ↓
Pages (app/page.tsx)
```

의존성은 위에서 아래 방향만 허용합니다. 역방향 import는 금지입니다.

## 질문 처리 흐름

```
사용자 질문
  │
  ├─ FAQ 키워드 매칭 (queryHelper.matchFaq) ──→ 즉시 반환 [배지: FAQ]
  │
  ├─ localStorage 캐시 확인 (24h TTL) ──────→ 즉시 반환 [배지: 캐시]
  │
  └─ /api/ask (Anthropic Haiku) ────────────→ 응답 캐시 저장 후 반환 [배지: AI]
```

## AI 진단 흐름

```
부품 클릭
  │
  └─ DiagnosisPanel 자동 마운트
       │
       └─ useDiagnosis.startDiagnosis()
            │
            └─ /api/diagnose (Claude Haiku, 최대 6턴)
                 │
                 ├─ isDone: false → DiagnosisCard (선택지 표시)
                 │
                 └─ isDone: true  → DiagnosisResult (원인·수리법·비용)
```

## 서버/클라이언트 경계

| 영역 | 위치 | Anthropic SDK 접근 |
|---|---|---|
| API Routes | `app/api/**` | ✅ 허용 |
| Hooks | `hooks/**` | ❌ fetch만 가능 |
| Components | `components/**` | ❌ 불가 |
| Pages | `app/page.tsx` | ❌ 불가 |

## 데이터 저장소

| 저장소 | 내용 | TTL |
|---|---|---|
| `data/devices.json` | 기기·부품·FAQ | 영구 (빌드 타임) |
| `localStorage` | API 응답 캐시 | 24시간 |
| `localStorage` | 진단 결과 | 무제한 (키: `diag_{deviceId}_{componentId}`) |
