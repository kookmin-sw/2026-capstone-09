# 프로젝트: FlowMeet

App Router를 사용하는 Next.js 16 플로우 기반 기획 애플리케이션입니다. 웹페이지와 Electron에서 동작합니다.

## 기술 스택

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **상태관리**: Tanstack-Query 5.100.9
- **스타일링**: Tailwind CSS 4
- **디자인 시스템**: @wanteddev/wds 3.4.6
- **패키지 매니저**: pnpm 10.10.0

## 코드 스타일

- TypeScript strict 모드 사용, `any` 타입 금지
- default export 대신 named export 사용
- CSS: Tailwind 유틸리티 클래스 사용, 커스텀 CSS 파일 금지.
- 원티드 디자인 시스템(https://montage.wanted.co.kr/) 사용.

## 명령어

- `pnpm run dev`: 개발 서버 시작 (포트 3000)
- `pnpm build`: 빌드 실행
- `pnpm dev:electron`: 일렉트론 실행
- `pnpm api:gen`: api 제너레이터 실행

## 아키텍처

- `/api`: API 라우트 및 api 세팅
- `/app`: Next.js App Router 페이지 및 레이아웃
- `/components/commons`: 재사용 가능한 컴포넌트
- `/hooks`: 두 개 이상에서 사용 예정인 커스텀 훅
- `/utils`: 유틸리티 및 공유 로직
- `/types`: 재사용 가능한 타입

## 중요 사항

### 절대 하지 말아야 할 것

- .env 파일은 절대 커밋하기
- any 타입 사용
- 직접적인 DOM 조작
- console.log 프로덕션 코드에 남기기

### 권장사항

- 실제 API 호출하는 코드 작성
- 재사용 가능한 컴포넌트 설계 및 컴포넌트 재사용
- 접근성(ally) 고려
- 성능 최적화 적용

### 문제 해결 우선순위

1. 실제 동작하는 해결책 찾기
2. 기존 코드 패턴 분석 후 일관성 유지
3. 타입 안전성 보장
