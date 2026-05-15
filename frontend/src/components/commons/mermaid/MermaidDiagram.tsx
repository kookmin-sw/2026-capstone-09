'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const render = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        mermaid.initialize({ startOnLoad: false });

        const getToken = (name: string): string =>
          getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#000000';

        const primaryColor = getToken('--color-primary-40');
        const secondaryColor = getToken('--color-secondary-40');
        const bgColor = getToken('--color-bg-primary');
        const textColor = getToken('--color-text-primary');
        const fontFamily = getToken('--font-family-body');

        if (document.fonts?.ready) {
          await document.fonts.ready;
        }

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });

        if (!containerRef.current) return;

        const styleEl = document.createElement('style');
        styleEl.textContent = `
          .mermaidDiagram .edgeLabel { fill: ${primaryColor} !important; }
          .mermaidDiagram .nodeLabel { color: ${textColor}; font-family: ${fontFamily}; }
          .mermaidDiagram .node rect { fill: ${bgColor}; stroke: ${secondaryColor}; }
        `;
        containerRef.current.appendChild(styleEl);

        await mermaid.render('mermaid', code, containerRef.current);

        const svg = containerRef.current.querySelector('svg');
        if (!svg) return;

        svg.classList.add('mermaidDiagram');

        svg.querySelectorAll('g[id^="node"] rect').forEach((rect) => {
          rect.setAttribute('rx', '12');
          rect.setAttribute('ry', '12');
        });

        svg.querySelectorAll('.edgeLabel').forEach((label) => {
          const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          bg.setAttribute('x', '-10');
          bg.setAttribute('y', '-10');
          bg.setAttribute('width', '20');
          bg.setAttribute('height', '20');
          bg.setAttribute('rx', '4');
          bg.setAttribute('fill', bgColor);
          bg.setAttribute('stroke', secondaryColor);
          label.insertBefore(bg, label.firstChild);
        });

        svg.style.maxHeight = '400px';
        svg.style.overflow = 'auto';
      } catch {
        if (containerRef.current) {
          containerRef.current.innerHTML = '<p>Error rendering diagram</p>';
        }
      }
    };

    render();
  }, [code]);

  return <div ref={containerRef} />;
}
