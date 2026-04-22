import dayjs from 'dayjs';

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅
 */
export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('YYYY.MM.DD');
};

/**
 * 태그 목록에서 표시할 태그와 나머지 개수 반환
 */
export const getVisibleTags = <T>(tags: T[], maxVisible = 2) => {
  const visibleTags = tags.slice(0, maxVisible);
  const remainingTagsCount = Math.max(0, tags.length - maxVisible);
  return { visibleTags, remainingTagsCount };
};