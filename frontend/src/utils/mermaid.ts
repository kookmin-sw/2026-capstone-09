import type { MeetingRelationship } from '@/components/projects/project-detail/multi-node-summary/types';

/**
 * 관계 배열을 Mermaid 파서가 안정적으로 읽을 수 있는 "graph TD" 코드로 변환한다.
 * 노드 라벨을 id와 분리하여 한글·공백·특수문자 파싱 문제를 회피한다.
 */
export const buildMermaidCode = (relationships: readonly MeetingRelationship[] | undefined | null): string => {
  if (!relationships || relationships.length === 0) return 'graph TD';
  const names = Array.from(new Set(relationships.flatMap((rel) => [rel.from, rel.to])));
  const idOf = new Map(names.map((name, index) => [name, `n${index}`]));
  const escape = (value: string) => value.replace(/"/g, '\\"');

  const lines: string[] = ['graph TD'];
  names.forEach((name) => lines.push(`    ${idOf.get(name)!}["${escape(name ?? '')}"]`));
  relationships.forEach((rel) => {
    const from = idOf.get(rel.from);
    const to = idOf.get(rel.to);
    if (from && to) lines.push(`    ${from} -->|${escape(rel.relation ?? '')}| ${to}`);
  });
  return lines.join('\n');
};

export interface ParsedIdea {
  title: string;
  body: string;
}

/**
 * "### 아이디어1: 제목\n내용\n\n### 아이디어2: ..." 형식을 파싱해
 * 각 아이디어의 title/body를 배열로 반환한다.
 */
export const parseDevelopmentIdeas = (text: string | undefined | null): ParsedIdea[] =>
  (text ?? '')
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
