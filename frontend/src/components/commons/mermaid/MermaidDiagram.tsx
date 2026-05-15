'use client';

import mermaid from 'mermaid';
import { useEffect, useId, useRef, useState } from 'react';

// CSS 변수 토큰을 문자열로 해석. mermaid가 SVG presentation attribute로 박아넣는 값들은
// CSS `var()`를 해석하지 못해 런타임에 계산된 hex/rgb가 필요하다.
const FALLBACK_TOKEN_VALUES: Record<string, string> = {
  '--color-background-normal-normal': '#FFFFFF',
  '--color-label-normal': '#171719',
  '--color-primary-40': '#03C98F',
  '--typography---label2---font-size': '0.8125rem',
};

const readCssToken = (name: string): string => {
  if (typeof window === 'undefined') return '';
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    FALLBACK_TOKEN_VALUES[name] ||
    ''
  );
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
      fontFamily: readCssToken('--font-pretendard') || 'Pretendard',
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

export const MermaidDiagram = ({ code }: MermaidDiagramProps) => {
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
        text.style.setProperty('font-size', 'var(--typography---label2---font-size)', 'important');
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
          const content = (text.textContent ?? '').trim();
          if (!content) return;
          const estWidth = content.length * 16;
          const estHeight = 20;
          box = { x: -estWidth / 2, y: -estHeight / 2, width: estWidth, height: estHeight };
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

  return (
    <div
      ref={ref}
      className="mermaid-diagram flex w-full justify-center [&_svg]:h-auto! [&_svg]:max-h-134! [&_svg]:w-auto! [&_svg]:max-w-full!"
    />
  );
};

MermaidDiagram.displayName = 'MermaidDiagram';