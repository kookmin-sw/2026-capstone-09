/**
 * 백엔드가 반환하는 이미지 URL을 브라우저에서 로드 가능한 형태로 정규화한다.
 *
 * - `undefined` / 빈 문자열 → `undefined`
 * - `https://...` / `http://...` / `//...` → 그대로 반환
 * - 그 외 (프로토콜 없는 경우) → `https://` 를 앞에 붙여 반환
 */
export const normalizeImageUrl = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  if (/^(https?:)?\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};
