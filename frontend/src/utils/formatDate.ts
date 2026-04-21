import type { DateType } from '@wanteddev/wds';

/**
 * WDS의 `DateType`(Date | string | null | undefined)을 안전하게 `Date` 인스턴스로 변환한다.
 * 유효하지 않은 입력은 `null`을 반환해, 호출 측에서 바로 early-return 처리할 수 있게 한다.
 *
 * NOTE: 날짜/시간 포맷 유틸은 현재 2~3곳에서 쓰이고 있어 가벼운 자체 구현만 두었다.
 * 상대시간/파싱/타임존 등 더 많은 기능이 필요해지면 `dayjs` 도입을 고려할 것.
 */
const toDate = (value: DateType): Date | null => {
  if (!value) return null;
  const instance = value instanceof Date ? value : new Date(value);
  return Number.isNaN(instance.getTime()) ? null : instance;
};

const pad2 = (value: number): string => String(value).padStart(2, '0');

/**
 * WDS의 DateType을 `YYYY-MM-DD`로 변환한다.
 * 파싱에 실패하거나 값이 없으면 빈 문자열을 반환한다.
 */
export const formatDateToYYYYMMDD = (value: DateType): string => {
  const date = toDate(value);
  if (!date) return '';
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

/**
 * WDS의 DateType을 `HH:mm`으로 변환한다.
 * 파싱에 실패하거나 값이 없으면 빈 문자열을 반환한다.
 */
export const formatDateToHHmm = (value: DateType): string => {
  const date = toDate(value);
  if (!date) return '';
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};
