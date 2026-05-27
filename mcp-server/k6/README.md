# MCP Server k6 성능 테스트

로컬 Docker에서 k6를 실행해 EC2 MCP 서버(`:8082`)를 대상으로 부하/스트레스 테스트를 진행한다.

## 파일 구조

```
k6/
├── .env.example         # 환경 변수 템플릿
├── config.js            # 환경 변수 로딩
├── lib/
│   └── mcp.js           # MCP JSON-RPC 헬퍼 + 커스텀 메트릭
├── load-test.js         # 부하 테스트 (~8분)
├── stress-test.js       # 스트레스 테스트 (~6분)
├── results/             # 결과 JSON 저장 (gitignore)
└── run.sh               # 전체 실행 스크립트
```

## 빠른 시작

### 1. 환경 변수 설정

```bash
cp k6/.env.example k6/.env
```

`.env` 파일에 아래 값을 입력한다.

| 변수 | 설명 |
|------|------|
| `MCP_URL` | EC2 MCP 서버 주소 (예: `http://1.2.3.4:8082`) |
| `JWT_TOKEN` | 테스트 계정 Bearer 토큰 |
| `PROJECT_ID` | 전용 테스트 프로젝트 ID |
| `NODE_ID` | 읽기/수정 테스트용 기존 노드 ID |

### 2. 전체 실행 (Load + Stress 순서대로)

```bash
bash k6/run.sh
```

### 3. 개별 실행

```bash
# Load Test만
docker run --rm \
  -v $(pwd)/k6:/scripts \
  -v $(pwd)/k6/results:/results \
  --env-file k6/.env \
  grafana/k6 run /scripts/load-test.js \
  --out json=/results/load.json

# Stress Test만
docker run --rm \
  -v $(pwd)/k6:/scripts \
  -v $(pwd)/k6/results:/results \
  --env-file k6/.env \
  grafana/k6 run /scripts/stress-test.js \
  --out json=/results/stress.json
```

## 테스트 시나리오

### Load Test (`load-test.js`)

| 단계 | VU | 시간 |
|------|----|------|
| ramp-up | 0 → 30 | 2분 |
| steady | 30 | 5분 |
| ramp-down | 30 → 0 | 1분 |

- **Threshold**: p95 응답시간 < 3,000ms, 오류율 < 1%
- **Tool 비율**: `get_nodes` 30% / `get_node` 25% / `update_node_status` 25% / `get_project_members` 15% / `ping` 5%

### Stress Test (`stress-test.js`)

| 단계 | VU | 시간 |
|------|----|------|
| 단계 1 | 0 → 10 | 1분 |
| 단계 2 | 10 → 30 | 1분 |
| 단계 3 | 30 → 60 | 1분 |
| 단계 4 | 60 → 100 | 2분 |
| ramp-down | 100 → 0 | 1분 |

- **목적**: 오류율이 급등하는 VU 수(breaking point) 탐색
- **Threshold**: 오류율 < 10% (느슨하게 — 실패 자체가 정보)
- **Tool 비율**: `get_nodes` 50% / `update_node_status` 30% / `get_node` 20%

## 커스텀 메트릭

| 메트릭 | 타입 | 태그 | 설명 |
|--------|------|------|------|
| `mcp_tool_duration` | Trend | `tool=<name>` | Tool별 응답 시간 (ms) |
| `mcp_tool_errors` | Counter | `tool=<name>` | Tool별 오류 횟수 |
| `mcp_error_rate` | Rate | — | 전체 MCP 오류율 |

## 결과 확인

1. **터미널 summary** — 테스트 종료 후 k6가 자동 출력 (p50/p95/p99, error rate)
2. **`results/*.json`** — 전체 요청 로그, 시계열 분석 가능
3. **MCP 서버 로그** — `ToolLoggingAspect` 출력으로 Tool별 처리 시간 대조
4. **EC2** — 별도 터미널에서 `top` 또는 CloudWatch로 CPU/메모리 확인

## 주의 사항

- JWT 토큰 만료 시간이 전체 테스트 시간(~15분)보다 길어야 한다
- `PROJECT_ID`는 팀원 실데이터와 분리된 **전용 테스트 프로젝트** 사용 권장
- EC2 Security Group에서 포트 **8082**가 로컬 IP에 열려 있어야 한다
- `results/*.json`은 `.gitignore`에 추가 권장 (용량 큼)
