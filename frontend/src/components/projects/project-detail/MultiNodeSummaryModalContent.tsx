'use client';

import { Chip, ContentBadge } from '@wanteddev/wds';
import { IconArrowRight, IconClose, IconDownload } from '@wanteddev/wds-icon';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import mermaid from 'mermaid';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

// ===== Types =====

export interface MultiNodeSummaryNode {
  id: string;
  label: string;
}

export interface MeetingRelationship {
  from: string;
  to: string;
  relation: string;
  reason: string;
}

export interface ActionItemsAnalysis {
  total_count: number;
  by_person: Record<string, { count: number; rate: number }>;
}

export interface MultiNodeSummaryResult {
  meeting_relationships: readonly MeetingRelationship[];
  action_items_analysis: ActionItemsAnalysis;
  development_ideas: string;
  mermaid_code: string;
}

interface MultiNodeSummaryModalContentProps {
  nodes: readonly MultiNodeSummaryNode[];
  result: MultiNodeSummaryResult;
  onDownloadClick?: () => void;
  onClose: () => void;
}

interface ParsedIdea {
  title: string;
  body: string;
}

// ===== Helpers =====

// 관계 배열을 Mermaid 파서가 안정적으로 읽을 수 있는 "graph TD" 코드로 변환.
// 노드 라벨을 id와 분리하여 한글·공백·특수문자 파싱 문제를 회피한다.
const buildMermaidCode = (relationships: readonly MeetingRelationship[]): string => {
  if (relationships.length === 0) return 'graph TD';
  const names = Array.from(new Set(relationships.flatMap((rel) => [rel.from, rel.to])));
  const idOf = new Map(names.map((name, index) => [name, `n${index}`]));
  const escape = (value: string) => value.replace(/"/g, '\\"');

  const lines: string[] = ['graph TD'];
  names.forEach((name) => lines.push(`    ${idOf.get(name)!}["${escape(name)}"]`));
  relationships.forEach((rel) => {
    const from = idOf.get(rel.from);
    const to = idOf.get(rel.to);
    if (from && to) lines.push(`    ${from} -->|${escape(rel.relation)}| ${to}`);
  });
  return lines.join('\n');
};

// "### 아이디어1: 제목\n내용\n\n### 아이디어2: ..." 형식을 파싱
const parseDevelopmentIdeas = (text: string): ParsedIdea[] =>
  text
    .split(/^###\s+/m)
    .filter((section) => section.trim().length > 0)
    .map((section) => {
      const newlineIndex = section.indexOf('\n');
      return newlineIndex === -1
        ? { title: section.trim(), body: '' }
        : {
            title: section.slice(0, newlineIndex).trim(),
            body: section.slice(newlineIndex + 1).trim(),
          };
    });

// ===== Mermaid init =====

// CSS 변수 토큰을 문자열로 해석. 하드코딩 hex 도입을 피하고 globals.css / variables.css의
// 단일 소스(`--color-*`, `--font-*`)만 쓰도록 강제.
const readCssToken = (name: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

// 라이브러리 적용 전 커스텀 SVG 톤 재현: 흰 배경 + primary 테두리.
// 라벨은 foreignObject 대신 순수 SVG text로 그린다 (htmlLabels:false).
// mermaid 기본 CSS가 엣지 라벨을 반투명/검정 text로 그리는 걸 막기 위해, 토큰을 쓰는 !important
// 스타일 태그를 head에 한 번 주입한다. 한 번만 실행되도록 flag로 가드.
let mermaidReady = false;
const ensureMermaidReady = () => {
  if (mermaidReady || typeof window === 'undefined') return;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      primaryColor: readCssToken('--color-background-normal-normal'),
      primaryTextColor: readCssToken('--color-label-normal'),
      primaryBorderColor: readCssToken('--color-primary-40'),
      lineColor: readCssToken('--color-primary-40'),
      fontFamily: readCssToken('--font-pretendard'),
      fontSize: readCssToken('--typography---label2---font-size') || '0.8125rem',
    },
    flowchart: {
      curve: 'basis',
      nodeSpacing: 56,
      rankSpacing: 72,
      padding: 8,
      htmlLabels: false,
      useMaxWidth: true,
    },
    securityLevel: 'loose',
  });

  if (!document.getElementById('mermaid-diagram-styles')) {
    const style = document.createElement('style');
    style.id = 'mermaid-diagram-styles';
    style.textContent = `
      .mermaid-diagram g.edgeLabel text,
      .mermaid-diagram g.edgeLabel tspan {
        fill: var(--color-primary-40) !important;
        font-size: var(--typography---caption1---font-size) !important;
        font-weight: 300 !important;
      }
      .mermaid-diagram g.edgeLabel rect {
        fill: var(--color-primary-99) !important;
        fill-opacity: 1 !important;
        opacity: 1 !important;
        stroke: var(--color-primary-40) !important;
      }
      .mermaid-diagram g.node rect {
        fill: var(--color-background-normal-normal) !important;
        stroke: var(--color-primary-40) !important;
      }
      .mermaid-diagram g.node text,
      .mermaid-diagram g.node tspan {
        font-size: var(--typography---label2---font-size) !important;
        font-weight: 400 !important;
      }
    `;
    document.head.appendChild(style);
  }

  mermaidReady = true;
};

interface MermaidDiagramProps {
  code: string;
}

const MermaidDiagram = ({ code }: MermaidDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureMermaidReady();
    let cancelled = false;
    const container = ref.current;
    if (!container) return;

    const run = async () => {
      const { svg } = await mermaid.render(`mermaid-${reactId}`, code);
      if (cancelled) return;
      container.innerHTML = svg;

      // 폰트 미로딩 상태에서 getBBox는 0을 반환해 라벨 알약이 0×0으로 들어간다.
      // 폰트 ready + 두 프레임 대기 후 측정.
      await (document.fonts?.ready ?? Promise.resolve()).catch(() => {});
      if (cancelled) return;
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      if (cancelled) return;

      // 노드 박스 모서리 라운드. 색상·테두리는 head의 style 태그(토큰 var)가 담당.
      container.querySelectorAll<SVGRectElement>('g.node rect').forEach((rect) => {
        rect.setAttribute('rx', '12');
        rect.setAttribute('ry', '12');
        rect.setAttribute('stroke-width', '1.5');
      });
      container.querySelectorAll<SVGGElement>('g.node').forEach((nodeG) => {
        const text = nodeG.querySelector<SVGTextElement>('text');
        if (!text) return;

        nodeG.style.setProperty('font-size', 'var(--typography---label2---font-size)', 'important');
        text.setAttribute('font-size', 'var(--typography---label2---font-size)');
        text.style.setProperty(
          'font-size',
          'var(--typography---label2---font-size)',
          'important',
        );
        text.querySelectorAll('tspan').forEach((tspan) => {
          tspan.setAttribute('font-size', 'var(--typography---label2---font-size)');
          tspan.style.setProperty(
            'font-size',
            'var(--typography---label2---font-size)',
            'important',
          );
        });
      });

      // 엣지 라벨 알약 — 크기·위치만 계산해 rect를 text 뒤에 삽입. 색/불투명도/텍스트 색상은
      // head에 주입된 !important CSS가 담당해 mermaid 기본 스타일을 확실히 덮는다.
      const svgNS = 'http://www.w3.org/2000/svg';
      container.querySelectorAll<SVGGElement>('g.edgeLabel').forEach((labelG) => {
        const text = labelG.querySelector<SVGTextElement>('text');
        if (!text) return;
        labelG.querySelectorAll('rect').forEach((r) => r.remove());

        labelG.style.setProperty('font-weight', '300', 'important');
        labelG.style.setProperty(
          'font-size',
          'var(--typography---caption1---font-size)',
          'important',
        );
        text.setAttribute('font-weight', '300');
        text.setAttribute('font-size', 'var(--typography---caption1---font-size)');
        text.style.setProperty('font-weight', '300', 'important');
        text.style.setProperty(
          'font-size',
          'var(--typography---caption1---font-size)',
          'important',
        );
        text.querySelectorAll('tspan').forEach((tspan) => {
          tspan.setAttribute('font-weight', '300');
          tspan.setAttribute('font-size', 'var(--typography---caption1---font-size)');
          tspan.style.setProperty('font-weight', '300', 'important');
          tspan.style.setProperty(
            'font-size',
            'var(--typography---caption1---font-size)',
            'important',
          );
        });

        let box: { x: number; y: number; width: number; height: number } | null = null;
        try {
          const b = text.getBBox();
          if (b.width > 0 && b.height > 0) {
            box = { x: b.x, y: b.y, width: b.width, height: b.height };
          }
        } catch {
          box = null;
        }
        if (!box) {
          // 폴백: 글자 수 기반 추정. 여기도 상수 값은 px이 아니라 "글자당 em ≈ 1.0 / 높이 1.2em" 감각.
          const content = (text.textContent ?? '').trim();
          if (!content) return;
          const estWidth = content.length * 16;
          const estHeight = 20;
          box = {
            x: -estWidth / 2,
            y: -estHeight / 2,
            width: estWidth,
            height: estHeight,
          };
        }

        const padX = 10;
        const padY = 4;
        const bgHeight = box.height + padY * 2;
        const bg = document.createElementNS(svgNS, 'rect');
        bg.setAttribute('x', String(box.x - padX));
        bg.setAttribute('y', String(box.y - padY));
        bg.setAttribute('width', String(box.width + padX * 2));
        bg.setAttribute('height', String(bgHeight));
        bg.setAttribute('rx', String(bgHeight / 2));
        bg.setAttribute('ry', String(bgHeight / 2));
        bg.setAttribute('stroke-width', '1');
        text.parentNode?.insertBefore(bg, text);
      });

      setError(null);
    };

    run().catch((err: unknown) => {
      if (cancelled) return;
      setError(err instanceof Error ? err.message : String(err));
    });

    return () => {
      cancelled = true;
    };
  }, [code, reactId]);

  if (error) {
    return (
      <p className="text-caption-1 text-label-alternative">
        다이어그램을 렌더링하지 못했어요: {error}
      </p>
    );
  }

  // 세로로 너무 길어 모달에서 잘려 보이지 않도록 SVG max-h로 비율 유지한 채 완화.
  return (
    <div
      ref={ref}
      className="mermaid-diagram flex w-full justify-center [&_svg]:!h-auto [&_svg]:!max-h-134 [&_svg]:!w-auto [&_svg]:!max-w-full"
    />
  );
};

export const MultiNodeSummaryModalContent = ({
  nodes,
  result,
  onDownloadClick,
  onClose,
}: MultiNodeSummaryModalContentProps) => {
  const pdfAreaRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const ideas = parseDevelopmentIdeas(result.development_ideas);
  const personEntries = Object.entries(result.action_items_analysis.by_person);
  const diagramCode = useMemo(
    () => buildMermaidCode(result.meeting_relationships),
    [result.meeting_relationships],
  );

  // 흐름:
  //   1) DefaultModal 카드 높이 고정 → 겉보기 크기 불변.
  //   2) area의 max-height/overflow 해제 → 전체 내용이 한 번에 레이아웃.
  //   3) 캡처 대상 area 맨 앞에 타이틀 복제본을 끼워 넣어 PDF 상단에도 "AI 다중 노드 요약" 노출.
  //   4) html2canvas로 area를 캡처한 뒤, section·li의 경계 좌표를 기준으로 페이지를 자르면
  //      카드가 페이지 사이에서 반으로 잘리지 않는다 (자연스러운 break).
  //   5) 각 페이지 슬라이스를 JPEG로 A4에 margin 두고 삽입.
  //   6) finally에서 타이틀 제거 + area/카드 스타일 원복.
  const handleDownloadClick = async () => {
    const area = pdfAreaRef.current;
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
    titleClone.textContent = 'AI 다중 노드 요약';
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

      pdf.save('AI-다중-노드-요약.pdf');
      onDownloadClick?.();
    } finally {
      if (titleClone.parentNode) titleClone.remove();
      Object.assign(area.style, savedAreaStyle);
      if (modalCard) modalCard.style.height = savedCardHeight;
      setIsDownloading(false);
    }
  };

  return (
    <>
      {isDownloading && (
        <div
          className="bg-static-white/80 fixed inset-0 z-[10000] flex items-center justify-center backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="border-primary-40 inline-block h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            <span className="text-body-1 text-label-normal font-medium">PDF를 준비하고 있어요</span>
          </div>
        </div>
      )}
      <div className="flex w-full flex-col gap-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-1 text-label-normal font-medium">AI 다중 노드 요약</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadClick}
              disabled={isDownloading}
              aria-label="요약 PDF 다운로드"
              className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconDownload className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
            >
              <IconClose className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 본문 — PDF 캡처 대상 영역 */}
        <div
          ref={pdfAreaRef}
          className="[&::-webkit-scrollbar-thumb]:bg-label-alternative/20 flex max-h-150 w-full flex-col gap-6 overflow-y-auto pr-2 [scrollbar-color:color-mix(in_srgb,var(--color-label-alternative)_20%,transparent)_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {/* 참조 노드 */}
          <section className="flex w-full flex-col gap-2">
            <span className="text-label-1 text-label-neutral font-semibold">참조 노드</span>
            <div className="border-line-normal-neutral flex min-h-12 w-full flex-wrap items-center gap-3 rounded-xl border px-3 py-2 [box-shadow:0_1px_2px_-1px_color-mix(in_srgb,var(--color-label-normal)_10%,transparent)]">
              {nodes.length === 0 ? (
                <span className="text-body-1 text-label-assistive">참조된 노드가 없어요.</span>
              ) : (
                nodes.map((node) => (
                  <Chip
                    key={node.id}
                    size="medium"
                    variant="solid"
                    color="neutral"
                    disableInteraction
                  >
                    <span className="text-caption-1 text-label-alternative font-medium">
                      {node.label}
                    </span>
                  </Chip>
                ))
              )}
            </div>
          </section>

          {/* 액션 아이템 분석 */}
          <section className="flex w-full flex-col gap-2">
            <span className="text-label-1 text-label-neutral font-semibold">액션 아이템 분석</span>
            <div className="border-label-disable flex flex-col gap-4 rounded-xl border p-3">
              <p className="text-body-1 text-label-normal">
                총{' '}
                <span className="text-primary-40 font-semibold">
                  {result.action_items_analysis.total_count}
                </span>
                개의 액션 아이템
              </p>
              <ul className="flex flex-col gap-2">
                {personEntries.map(([name, { count, rate }]) => {
                  const percent = Math.round(rate * 100);
                  return (
                    <li key={name} className="flex items-center gap-3">
                      <span className="text-label-1 text-label-normal w-16 shrink-0 font-medium">
                        {name}
                      </span>
                      <div className="bg-fill-normal relative h-2 flex-1 overflow-hidden rounded-full">
                        <div
                          className="bg-primary-40 absolute inset-y-0 left-0 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-caption-1 text-label-alternative w-20 shrink-0 text-right">
                        {count}개 ({percent}%)
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* 회의 관계 */}
          <section className="flex w-full flex-col gap-2">
            <span className="text-label-1 text-label-neutral font-semibold">회의 관계</span>
            <ul className="border-label-disable flex flex-col gap-3 rounded-xl border p-3">
              {result.meeting_relationships.map((rel, index) => (
                <li
                  key={`${rel.from}-${rel.to}-${index}`}
                  className="border-line-solid-neutral flex flex-col gap-1.5 rounded-lg border p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-label-1 text-label-normal font-medium">{rel.from}</span>
                    <IconArrowRight className="text-label-alternative h-4 w-4" aria-hidden="true" />
                    <span className="text-label-1 text-label-normal font-medium">{rel.to}</span>
                    <ContentBadge
                      size="xsmall"
                      variant="solid"
                      color="accent"
                      className="!bg-primary-40/10 !text-primary-40"
                    >
                      {rel.relation}
                    </ContentBadge>
                  </div>
                  <p className="text-label-1 text-label-alternative">{rel.reason}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 개선 아이디어 */}
          <section className="flex w-full flex-col gap-2">
            <span className="text-label-1 text-label-neutral font-semibold">개선 아이디어</span>
            <ul className="border-label-disable flex flex-col gap-3 rounded-xl border p-3">
              {ideas.map((idea, index) => (
                <li
                  key={`${idea.title}-${index}`}
                  className="border-line-solid-neutral flex flex-col gap-1.5 rounded-lg border p-3"
                >
                  <h4 className="text-label-1 text-label-normal font-semibold">{idea.title}</h4>
                  <p className="text-label-1 text-label-alternative whitespace-pre-line">
                    {idea.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* 관계 다이어그램 */}
          <section className="flex w-full flex-col gap-2">
            <span className="text-label-1 text-label-neutral font-semibold">관계 다이어그램</span>
            <div className="bg-background-normal-alternative border-label-disable overflow-x-auto rounded-xl border p-3">
              <MermaidDiagram code={diagramCode} />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

MultiNodeSummaryModalContent.displayName = 'MultiNodeSummaryModalContent';
