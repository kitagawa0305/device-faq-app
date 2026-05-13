# SECURITY.md — 보안 정책

## API 키 관리

- `ANTHROPIC_API_KEY`는 `.env.local`에만 저장
- `.env.local`은 `.gitignore`에 포함됨 — 절대 커밋 금지
- Vercel 배포 시 Environment Variables에 별도 설정 필요
- 클라이언트 컴포넌트에서 `process.env.ANTHROPIC_API_KEY` 참조 금지

## API 라우트 보안

- 모든 Anthropic 호출은 `app/api/` 서버 라우트에서만 실행
- 요청 본문 유효성 검사: 필수 필드 누락 시 400 반환
- 이미지 업로드: 허용 MIME 타입 화이트리스트 검사 (JPEG/PNG/GIF/WebP)
- 이미지 크기 제한: 5MB 초과 시 400 반환

## 금지 사항

- `NEXT_PUBLIC_` 접두사로 API 키 노출 절대 금지
- 사용자 입력을 프롬프트에 직접 삽입 시 길이 제한 적용 (1000자)
- 외부 URL redirect 금지
