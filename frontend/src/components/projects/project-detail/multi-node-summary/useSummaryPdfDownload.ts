'use client';

import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { type RefObject, useState } from 'react';

// CSS 변수 토큰을 문자열로 해석. html2canvas의 backgroundColor나 Canvas API처럼
// CSS `var()`가 통하지 않는 곳에서만 사용.
const readCssToken = (name: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

/**
 * 요약 모달의 내용을 A4 PDF로 캡처/분할 저장한다.
 *
 * 흐름:
 *   1) DefaultModal 카드 높이 고정 → 겉보기 크기 불변.
 *   2) area의 max-height/overflow 해제 → 전체 내용이 한 번에 레이아웃.
 *   3) 캡처 대상 area 맨 앞에 타이틀 복제본을 끼워 넣어 PDF 상단에도 "AI 다중 노드 요약" 노출.
 *   4) html2canvas로 area를 캡처한 뒤, section·li의 경계 좌표를 기준으로 페이지를 자르면
 *      카드가 페이지 사이에서 반으로 잘리지 않는다 (자연스러운 break).
 *   5) 각 페이지 슬라이스를 JPEG로 A4에 margin 두고 삽입.
 *   6) finally에서 타이틀 제거 + area/카드 스타일 원복.
 */
interface UseSummaryPdfDownloadParams {
  areaRef: RefObject<HTMLDivElement | null>;
  onDownloaded?: () => void;
  title?: string;
  fileName?: string;
}

export const useSummaryPdfDownload = ({
  areaRef,
  onDownloaded,
  title = 'AI 다중 노드 요약',
  fileName = 'AI-다중-노드-요약.pdf',
}: UseSummaryPdfDownloadParams) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = async () => {
    const area = areaRef.current;
    if (!area || isDownloading) return;

    setIsDownloading(true);

    const modalCard =
      area.closest<HTMLElement>('.overflow-hidden.rounded-4xl') ??
      (area.closest<HTMLElement>('[role="dialog"]')?.firstElementChild as HTMLElement | null);

    const savedAreaStyle = {
      maxHeight: area.style.maxHeight,
      height: area.style.height,
      overflow: area.style.overflow,
      paddingRight: area.style.paddingRight,
    };
    const savedCardHeight = modalCard?.style.height ?? '';

    // PDF 상단에 노출할 타이틀 (캡처 직전에만 area에 끼워 넣었다 finally에서 제거)
    const titleClone = document.createElement('h2');
    titleClone.textContent = title;
    titleClone.className = 'text-heading-1 text-label-normal font-medium';

    try {
      if (modalCard) modalCard.style.height = `${modalCard.offsetHeight}px`;
      Object.assign(area.style, {
        maxHeight: 'none',
        height: 'auto',
        overflow: 'visible',
        paddingRight: '0',
      });
      area.insertBefore(titleClone, area.firstChild);

      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      const scale = 2;
      const pageBg = readCssToken('--color-background-normal-normal');
      const canvas = await html2canvas(area, {
        scale,
        useCORS: true,
        backgroundColor: pageBg,
      });

      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgWidthMm = pageWidth - margin * 2;
      const renderableHeightMm = pageHeight - margin * 2;
      const pxPerMm = canvas.width / imgWidthMm;
      const pageHeightPx = Math.max(1, Math.floor(renderableHeightMm * pxPerMm));

      // section / li의 시작 y를 canvas 좌표로 모아 "자연스러운 페이지 경계" 후보를 만든다.
      const areaRect = area.getBoundingClientRect();
      const breakPoints = new Set<number>([0, canvas.height]);
      area.querySelectorAll<HTMLElement>('section, li').forEach((el) => {
        const y = Math.round((el.getBoundingClientRect().top - areaRect.top) * scale);
        if (y > 0 && y < canvas.height) breakPoints.add(y);
      });
      const sortedBreaks = Array.from(breakPoints).sort((a, b) => a - b);

      const topLevelBlocks = Array.from(area.children)
        .map((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          const start = Math.round((rect.top - areaRect.top) * scale);
          const end = Math.round((rect.bottom - areaRect.top) * scale);
          return {
            element: el as HTMLElement,
            start,
            end,
            height: end - start,
          };
        })
        .filter((block) => block.end > block.start);

      // 각 페이지의 [start, end]를 결정.
      // 우선 섹션 단위로 넘겨서 잘림을 막고, 섹션 자체가 한 페이지보다 큰 경우에만
      // 내부 break(section/li 시작점)로 내려가 자연스럽게 자른다.
      const slices: Array<{ start: number; end: number }> = [];
      let pageStart = 0;
      while (pageStart < canvas.height) {
        const hardEnd = Math.min(pageStart + pageHeightPx, canvas.height);
        const overflowingBlock = topLevelBlocks.find(
          (block) => block.start < hardEnd && block.end > hardEnd,
        );

        let end = hardEnd;

        if (
          overflowingBlock &&
          overflowingBlock.start > pageStart &&
          overflowingBlock.height <= pageHeightPx
        ) {
          end = overflowingBlock.start;
        } else {
          for (let i = sortedBreaks.length - 1; i >= 0; i -= 1) {
            if (sortedBreaks[i] > pageStart && sortedBreaks[i] <= hardEnd) {
              end = sortedBreaks[i];
              break;
            }
          }
        }

        if (end <= pageStart) end = hardEnd;
        slices.push({ start: pageStart, end });
        pageStart = end;
      }

      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      if (!pageCtx) throw new Error('Canvas 컨텍스트를 만들 수 없어요.');

      slices.forEach(({ start, end }, i) => {
        const sliceHeightPx = end - start;
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeightPx;
        pageCtx.fillStyle = pageBg;
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0,
          start,
          canvas.width,
          sliceHeightPx,
          0,
          0,
          canvas.width,
          sliceHeightPx,
        );

        if (i > 0) pdf.addPage();
        pdf.addImage(
          pageCanvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          margin,
          margin,
          imgWidthMm,
          sliceHeightPx / pxPerMm,
        );
      });

      pdf.save(fileName);
      onDownloaded?.();
    } finally {
      if (titleClone.parentNode) titleClone.remove();
      Object.assign(area.style, savedAreaStyle);
      if (modalCard) modalCard.style.height = savedCardHeight;
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownloadClick };
};
