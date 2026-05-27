import http from 'k6/http';
import { check } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';

// ── 커스텀 메트릭 ─────────────────────────────────────────────
export const toolDuration = new Trend('mcp_tool_duration', true); // ms 단위
export const toolErrors   = new Counter('mcp_tool_errors');
export const errorRate    = new Rate('mcp_error_rate');

// ── 내부 상태 (VU별 격리됨) ───────────────────────────────────
let requestCounter = 0;

function nextId() {
  // VU ID * 10000 으로 다른 VU와 ID 충돌 방지
  return __VU * 10000 + (++requestCounter);
}

// ── 공통 요청 ─────────────────────────────────────────────────
function mcpPost(baseUrl, sessionId, token, body) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
  };
  if (token)     headers['Authorization']  = `Bearer ${token}`;
  if (sessionId) headers['Mcp-Session-Id'] = sessionId;

  return http.post(
    `${baseUrl}/mcp`,
    JSON.stringify(body),
    { headers, timeout: '30s' },
  );
}

// ── SSE / JSON 응답 파싱 ──────────────────────────────────────
// Spring AI MCP STREAMABLE은 application/json 또는 text/event-stream 모두 가능
export function parseResponse(res) {
  const ct = (res.headers['Content-Type'] || '').toLowerCase();

  if (ct.includes('text/event-stream')) {
    // SSE 형식: "data: {...}\n\n" 에서 첫 번째 data 줄 추출
    for (const line of res.body.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data:')) {
        const payload = trimmed.slice(5).trim();
        if (payload && payload !== '[DONE]') {
          try { return JSON.parse(payload); } catch (_) { /* skip */ }
        }
      }
    }
    return null;
  }

  try { return JSON.parse(res.body); } catch (_) { return null; }
}

// ── MCP 세션 초기화 ───────────────────────────────────────────
// 반환값: sessionId (string) 또는 null (세션 ID 없는 서버)
export function initSession(baseUrl, token) {
  // 1) initialize
  const initRes = mcpPost(baseUrl, null, token, {
    jsonrpc: '2.0',
    id: nextId(),
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'k6-perf-test', version: '1.0.0' },
    },
  });

  const initOk = check(initRes, {
    'initialize: HTTP 200': (r) => r.status === 200,
  });

  if (!initOk) {
    console.error(`[VU ${__VU}] initialize 실패 — status: ${initRes.status}`);
    return null;
  }

  const sessionId = initRes.headers['Mcp-Session-Id'] || null;

  // 2) notifications/initialized (알림이므로 id 없음, 응답 무시)
  mcpPost(baseUrl, sessionId, token, {
    jsonrpc: '2.0',
    method: 'notifications/initialized',
  });

  return sessionId;
}

// ── Tool 호출 ─────────────────────────────────────────────────
export function callTool(baseUrl, sessionId, token, toolName, args) {
  const start = Date.now();

  const res = mcpPost(baseUrl, sessionId, token, {
    jsonrpc: '2.0',
    id: nextId(),
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args || {},
    },
  });

  const duration = Date.now() - start;
  const parsed   = parseResponse(res);
  const hasError = res.status !== 200 || !!(parsed && parsed.error);

  // 메트릭 기록
  toolDuration.add(duration, { tool: toolName });
  errorRate.add(hasError);
  if (hasError) toolErrors.add(1, { tool: toolName });

  check(res, {
    [`${toolName}: HTTP 200`]: (r) => r.status === 200,
    [`${toolName}: no JSON-RPC error`]: () => !(parsed && parsed.error),
  });

  if (hasError) {
    const errMsg = parsed?.error?.message ?? res.status;
    console.warn(`[VU ${__VU}] ${toolName} 오류 — ${errMsg}`);
  }

  return { res, parsed, duration, hasError };
}
