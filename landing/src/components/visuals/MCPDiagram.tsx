'use client';

import { motion } from 'framer-motion';

const LANES = [
  { id: 'user', label: 'User', sub: '자연어 요청', accent: '#ffffff', pos: 80 },
  { id: 'host', label: 'MCP Host', sub: '에이전트 + LLM', accent: '#04e6a2', pos: 320 },
  { id: 'server', label: 'MCP Server', sub: 'Tool · Resource', accent: '#7BD3FF', pos: 620 },
  { id: 'ext', label: 'External', sub: 'DB · API · Files', accent: '#C7B8FF', pos: 920 },
];

const MESSAGES = [
  { id: 1, from: 'user', to: 'host', label: '“진행 정리해줘”', kind: 'req', y: 110 },
  { id: 2, from: 'host', to: 'server', label: 'tool_call(list_nodes)', kind: 'req', y: 170 },
  { id: 3, from: 'server', to: 'ext', label: 'SELECT * FROM nodes', kind: 'req', y: 230 },
  { id: 4, from: 'ext', to: 'server', label: 'rows[…]', kind: 'res', y: 290 },
  { id: 5, from: 'server', to: 'host', label: 'tool_result(nodes)', kind: 'res', y: 350 },
  { id: 6, from: 'host', to: 'user', label: '맥락 정리된 답변', kind: 'res', y: 420 },
];

export function MCPDiagram() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0d12]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary-50)]">
            Model Context Protocol
          </p>
          <p className="mt-0.5 text-[14px] text-white">
            User → Host → Server → External, 양방향 메시지 흐름
          </p>
        </div>
        <span className="rounded-full border border-[var(--color-primary-50)]/30 bg-[var(--color-primary-50)]/[0.06] px-2.5 py-1 text-[10px] tracking-[0.15em] text-[var(--color-primary-50)]">
          MCP
        </span>
      </div>

      <div className="relative">
        <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-25" />
        <svg viewBox="0 0 1000 480" className="relative h-full w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="mcp-arrow-req" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#04e6a2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#04e6a2" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="mcp-arrow-res" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7BD3FF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7BD3FF" stopOpacity="0.3" />
            </linearGradient>
            <marker id="arrow-primary" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#04e6a2" />
            </marker>
            <marker id="arrow-blue" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#7BD3FF" />
            </marker>
          </defs>

          {/* Lane headers */}
          {LANES.map((lane, i) => (
            <motion.g
              key={lane.id}
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <rect
                x={lane.pos - 60}
                y={20}
                width={120}
                height={50}
                rx={10}
                fill={`${lane.accent}20`}
                stroke={`${lane.accent}55`}
                strokeWidth="1"
              />
              <circle cx={lane.pos - 48} cy={36} r="3" fill={lane.accent} />
              <text x={lane.pos - 38} y={40} fontSize="11" fill="rgba(255,255,255,0.6)" fontFamily="Pretendard Variable, Pretendard, sans-serif">
                {lane.id === 'host' ? 'HOST' : lane.id === 'server' ? 'SERVER' : lane.id.toUpperCase()}
              </text>
              <text x={lane.pos} y={58} textAnchor="middle" fontSize="13" fontWeight="600" fill="#fff" fontFamily="Pretendard Variable, Pretendard, sans-serif">
                {lane.label}
              </text>
            </motion.g>
          ))}

          {/* Vertical lane lines */}
          {LANES.map((lane) => (
            <line
              key={`line-${lane.id}`}
              x1={lane.pos}
              y1={70}
              x2={lane.pos}
              y2={460}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 4"
            />
          ))}

          {/* Messages */}
          {MESSAGES.map((m, i) => {
            const fromLane = LANES.find((l) => l.id === m.from)!;
            const toLane = LANES.find((l) => l.id === m.to)!;
            const x1 = fromLane.pos;
            const x2 = toLane.pos;
            const isReq = m.kind === 'req';
            const stroke = isReq ? 'url(#mcp-arrow-req)' : 'url(#mcp-arrow-res)';
            const marker = isReq ? 'arrow-primary' : 'arrow-blue';
            const labelX = (x1 + x2) / 2;
            const dir = x1 < x2 ? 1 : -1;
            return (
              <motion.g
                key={m.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.18 }}
              >
                {/* step number */}
                <circle cx={x1 + dir * 14} cy={m.y} r="9" fill={isReq ? '#04e6a2' : '#7BD3FF'} />
                <text x={x1 + dir * 14} y={m.y + 3} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#062018" fontFamily="Pretendard Variable, Pretendard, sans-serif">
                  {m.id}
                </text>
                {/* arrow line */}
                <motion.line
                  x1={x1 + dir * 26}
                  y1={m.y}
                  x2={x2 - dir * 8}
                  y2={m.y}
                  stroke={stroke}
                  strokeWidth="1.4"
                  markerEnd={`url(#${marker})`}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.18 }}
                />
                {/* label */}
                <rect
                  x={labelX - 95}
                  y={m.y - 24}
                  width={190}
                  height={18}
                  rx={5}
                  fill="rgba(10,13,18,0.85)"
                  stroke={isReq ? 'rgba(4,230,162,0.30)' : 'rgba(123,211,255,0.30)'}
                />
                <text
                  x={labelX}
                  y={m.y - 11}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill="#fff"
                  fontFamily="Pretendard Variable, Pretendard, sans-serif"
                >
                  {m.label}
                </text>
              </motion.g>
            );
          })}

          {/* Side labels for direction */}
          <motion.text
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.5 }}
            x={20}
            y={170}
            fontSize="9.5"
            fill="rgba(4,230,162,0.7)"
            fontFamily="Pretendard Variable, Pretendard, sans-serif"
            transform="rotate(-90, 20, 170)"
            textAnchor="middle"
          >
            REQUEST ↓
          </motion.text>
          <motion.text
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.7 }}
            x={20}
            y={350}
            fontSize="9.5"
            fill="rgba(123,211,255,0.7)"
            fontFamily="Pretendard Variable, Pretendard, sans-serif"
            transform="rotate(-90, 20, 350)"
            textAnchor="middle"
          >
            RESPONSE ↑
          </motion.text>
        </svg>
      </div>

      <div className="border-t border-white/[0.06] px-5 py-4 text-[12.5px] leading-[1.7] text-[var(--color-text-muted)]">
        flowMeet은 노드·회의록·외부 통합을 <span className="text-[var(--color-primary-50)]">MCP Server</span>로 노출합니다.
        에이전트(Host)는 표준 MCP 메시지로 LLM과 대화하며, 결과를 사용자에게 다시 돌려줍니다.
      </div>
    </div>
  );
}
