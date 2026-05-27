/**
 * Load Test (부하 테스트)
 *
 * 정상 ~ 예상 최대 트래픽 구간에서 응답 시간과 오류율 측정.
 *
 * stages:  0 → 30 VU (2분) → steady 30 VU (5분) → 0 (1분)  총 ~8분
 * tools:   get_nodes 30% / get_node 25% / update_node_status 25%
 *          / get_project_members 15% / ping 5%
 */

import { sleep } from 'k6';
import { BASE_URL, TOKEN, PROJECT_ID, NODE_ID } from './config.js';
import { initSession, callTool } from './lib/mcp.js';

// ── k6 옵션 ──────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '2m', target: 30 }, // ramp-up
    { duration: '5m', target: 30 }, // steady
    { duration: '1m', target: 0  }, // ramp-down
  ],
  thresholds: {
    http_req_duration:    ['p(95)<3000'], // 95%ile 응답시간 3초 이내
    mcp_error_rate:       ['rate<0.01'],  // 오류율 1% 미만
    http_req_failed:      ['rate<0.01'],
  },
};

// ── 사전 검증 ─────────────────────────────────────────────────
export function setup() {
  if (!TOKEN)      console.error('❌ JWT_TOKEN 이 설정되지 않았습니다.');
  if (!PROJECT_ID) console.error('❌ PROJECT_ID 가 설정되지 않았습니다.');
  if (!NODE_ID)    console.error('❌ NODE_ID 가 설정되지 않았습니다.');
  console.log(`🎯 대상 서버: ${BASE_URL}`);
}

// ── VU별 세션 (iteration 간 유지) ─────────────────────────────
let sessionId = null;

// ── Tool 선택 (가중치 기반) ───────────────────────────────────
const STATUS_CYCLE = ['WAITING', 'IN_PROGRESS', 'DONE'];

function pickScenario() {
  const r = Math.random() * 100;
  if (r < 5)  return { tool: 'ping',                 args: {} };
  if (r < 20) return { tool: 'get_project_members',  args: { projectId: PROJECT_ID } };
  if (r < 45) return { tool: 'update_node_status',   args: { projectId: PROJECT_ID, nodeId: NODE_ID, status: STATUS_CYCLE[Math.floor(Math.random() * 3)] } };
  if (r < 70) return { tool: 'get_node',             args: { projectId: PROJECT_ID, nodeId: NODE_ID } };
  return           { tool: 'get_nodes',              args: { projectId: PROJECT_ID } };
}

// ── 메인 VU 함수 ──────────────────────────────────────────────
export default function () {
  // 최초 iteration에만 세션 초기화
  if (!sessionId) {
    sessionId = initSession(BASE_URL, TOKEN);
  }

  const { tool, args } = pickScenario();
  callTool(BASE_URL, sessionId, TOKEN, tool, args);

  sleep(1); // think time: 실제 사용 패턴과 유사하게
}
