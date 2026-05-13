# DESIGN.md — UI/UX 디자인 원칙

## 레이아웃

```
┌─────────┬──────────────────────┬──────────────────┐
│ Sidebar │   DeviceDiagram      │  ChatPanel /     │
│ (기기)  │   (SVG 인터랙티브)   │  DiagnosisPanel  │
│  w-44   │   flex-1             │  w-96            │
└─────────┴──────────────────────┴──────────────────┘
```

## 색상 시스템

| 역할 | 클래스 |
|---|---|
| 배경 (최외각) | `bg-gray-950` |
| 패널 배경 | `bg-gray-900` |
| 카드 배경 | `bg-gray-800` |
| 테두리 | `border-gray-700` |
| 기본 텍스트 | `text-white` |
| 보조 텍스트 | `text-gray-400` |

## 애니메이션

- 카드 등장: `animate-fade-slide` (0.25s ease-out, translateY 8px → 0)
- 로딩: `animate-pulse`
- 버튼 호버: `transition-colors`

## 부품 점 색상 (SVG)

| 색상 | 의미 |
|---|---|
| 초록 (`#34d399`) | DIY 가능 |
| 노랑 (`#fbbf24`) | 전문가 권장 |
| 빨강 (`#f87171`) | 전문가 필요 |
