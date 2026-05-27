/**
 * Stress Test (스트레스 테스트)
 *
 * 트래픽을 점진적으로 높여 시스템이 한계에 도달하는 VU 수(breaking point)를 탐색.
 * 오류율이 급등하는 구간이 병목 지점.
 *
 * stages:  0→10 (1분) → 30 (1분) → 60 (1분) → 100 (2분) → 0 (1분)  총 ~6분
 * tools:   get_nodes 50% / update_node_status 30% / get_node 20%  (부하 집중)
 */

import { sleep } from 'k6';
import { BASE_URL, TOKEN, PROJECT_ID, NODE_ID } from './config.js';
import { initSession, callTool } from './lib/mcp.js';

// ── k6 옵션 ──────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '1m', target: 10  },
    { duration: '1m', target: 30  },
    { duration: '1m', target: 60  },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0   },
  ],
  thresholds: {
    // 느슨하게 설정 — threshold 실패 자체가 breaking point 정보
    mcp_error_rate:  ['rate<0.10'], // 오류율 10% 미만
    http_req_failed: ['rate<0.10'],
  },
};

// ── 사전 검증 ─────────────────────────────────────────────────
export function setup() {
  if (!TOKEN)      console.error('❌ JWT_TOKEN 이 설정되지 않았습니다.');
  if (!PROJECT_ID) console.error('❌ PROJECT_ID 가 설정되지 않았습니다.');
  if (!NODE_ID)    console.error('❌ NODE_ID 가 설정되지 않았습니다.');
  console.log(`🎯 대상 서버: ${BASE_URL}`);
  console.log('⚡ Stress Test — breaking point 탐색 모드');
}

// ── VU별 세션 (iteration 간 유지) ─────────────────────────────
let sessionId = null;

const STATUS_CYCLE = ['WAITING', 'IN_PROGRESS', 'DONE'];

function pickScenario() {
  const r = Math.random() * 100;
  // 부하가 큰 시나리오에 집중 (리스트 조회 + 쓰기)
  if (r < 50) return { tool: 'get_nodes',           args: { projectId: PROJECT_ID } };
  if (r < 80) return { tool: 'update_node_status',  args: { projectId: PROJECT_ID, nodeId: NODE_ID, status: STATUS_CYCLE[Math.floor(Math.random() * 3)] } };
  return           { tool: 'get_node',              args: { projectId: PROJECT_ID, nodeId: NODE_ID } };
}

// ── 메인 VU 함수 ──────────────────────────────────────────────
export default function () {
  if (!sessionId) {
    sessionId = initSession(BASE_URL, TOKEN);
  }

  const { tool, args } = pickScenario();
  callTool(BASE_URL, sessionId, TOKEN, tool, args);

  sleep(0.5); // think time 짧게 → 고부하 유도
}
