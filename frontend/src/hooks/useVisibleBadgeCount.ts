import { useState, useLayoutEffect, useEffect, useCallback, type RefObject } from 'react';

interface DropdownOption {
  label: string;
  value: string;
  leadingContent?: React.ReactNode;
  trailingContent?: React.ReactNode;
}

/**
 * 드롭다운에 표시할 배지 개수를 계산하는 훅
 *
 * @param selectedOptions - 선택된 옵션 배열
 * @param containerRef - 드롭다운 컨테이너 ref
 * @param badgesRef - 측정용 배지 컨테이너 ref
 * @param iconRef - 아이콘 영역 ref
 * @param plusBadgeRef - +N 배지 ref
 * @returns 표시할 배지 개수
 */
export function useVisibleBadgeCount(
  selectedOptions: DropdownOption[],
  containerRef: RefObject<HTMLDivElement | null>,
  badgesRef: RefObject<HTMLDivElement | null>,
  iconRef: RefObject<HTMLDivElement | null>,
  plusBadgeRef: RefObject<HTMLDivElement | null>
) {
  const [visibleCount, setVisibleCount] = useState(selectedOptions.length);

  const calculateCount = useCallback(() => {
    // selectedOptions가 없으면 0으로 설정
    if (selectedOptions.length === 0) {
      setVisibleCount(0);
      return;
    }

    if (!badgesRef.current || !containerRef.current || !iconRef.current || !plusBadgeRef.current) {
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const iconWidth = iconRef.current.offsetWidth;
    const plusBadgeWidth = plusBadgeRef.current.offsetWidth;
    const availableWidth = containerWidth - 24 - iconWidth - 8;

    const badges = Array.from(badgesRef.current.children) as HTMLElement[];
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < badges.length; i++) {
      const badgeWidth = badges[i].offsetWidth;
      const gap = count > 0 ? 4 : 0;
      const newTotal = totalWidth + gap + badgeWidth;
      const remaining = badges.length - (count + 1);
      const required = newTotal + (remaining > 0 ? 4 + plusBadgeWidth : 0);

      // 15% 여유
      if (required * 1.15 <= availableWidth) {
        totalWidth = newTotal;
        count++;
      } else {
        break;
      }
    }

    setVisibleCount(count);
  }, [selectedOptions, badgesRef, containerRef, iconRef, plusBadgeRef]);

  // selectedOptions 변경 시 계산
  useLayoutEffect(() => {
    requestAnimationFrame(calculateCount);
  }, [calculateCount]);

  // ResizeObserver로 컨테이너 크기 변경 감지
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(calculateCount);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [containerRef, calculateCount]);

  return visibleCount;
}