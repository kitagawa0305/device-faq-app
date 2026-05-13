# PLANS.md — 로드맵

## 완료된 기능

- [x] 기기·부품·FAQ 정적 데이터 (`data/devices.json`)
- [x] SVG 인터랙티브 부품 도해
- [x] FAQ 매칭 → 캐시 → AI 폴백
- [x] 수리 난이도 + 예상 비용 표시
- [x] 사진 업로드 + Claude Vision 분석
- [x] AI 진단 플로우차트 (최대 6턴 객관식)

## 다음 우선순위

| 우선순위 | 기능 | 예상 복잡도 |
|---|---|---|
| 1 | 스트리밍 응답 (AI 답변 실시간 출력) | 중 |
| 2 | 대화 히스토리 저장 (기기별 localStorage) | 하 |
| 3 | 관련 질문 추천 (답변 후 칩 3개 생성) | 중 |
| 4 | 음성 입력 (Web Speech API) | 중 |
| 5 | 가전제품 확장 (에어컨·냉장고·세탁기) | 하 |
| 6 | 관리자 페이지 (코드 없이 FAQ 추가) | 상 |

## 기술 부채

→ [`exec-plans/tech-debt-tracker.md`](./exec-plans/tech-debt-tracker.md)
