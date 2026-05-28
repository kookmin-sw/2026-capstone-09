/**
 * ISO 8601 날짜 문자열을 상대 시간 텍스트로 변환
 * @param isoString - ISO 8601 형식의 날짜 문자열 (예: "2026-04-15T10:30:00Z")
 * @returns 상대 시간 텍스트 (예: "방금 전", "3분 전", "2일 전")
 */
export function getRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  // 밀리초 차이 계산
  const diffMs = now.getTime() - date.getTime();

  // 각 단위로 변환
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // 1분 미만
  if (diffSeconds < 60) {
    return '방금 전';
  }

  // 1시간 미만
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  // 24시간 미만
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  // 30일 미만
  if (diffDays < 30) {
    return `${diffDays}일 전`;
  }

  // 365일 미만 - 개월 단위
  if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths}개월 전`;
  }

  // 365일 이상 - 년 단위
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}년 전`;
}