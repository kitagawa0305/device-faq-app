# 사진 분석 (Claude Vision)

## 기능 설명

사용자가 기기 파손 사진을 업로드하면 Claude Haiku Vision이 손상 부위, 원인, 수리 방법을 분석합니다.

## 진입점

- ChatPanel 하단 카메라 버튼 클릭
- 채팅 패널 위로 이미지 드래그 & 드롭

## 제약 사항

- 허용 포맷: JPEG, PNG, GIF, WebP
- 최대 파일 크기: 5MB
- 응답 최대 토큰: 600

## API 흐름

```
ChatPanel → FormData(image, deviceName, componentName?)
  → POST /api/analyze-photo
  → Claude Haiku (base64 이미지 + 텍스트 프롬프트)
  → { answer, source: "photo" }
```

## 응답 배지

| 배지 | 색상 |
|---|---|
| 사진 분석 | 보라 |
