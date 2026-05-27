#!/bin/bash
# MCP Server k6 성능 테스트 실행 스크립트 (Docker 기반)
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
RESULTS_DIR="$SCRIPT_DIR/results"

# ── .env 파일 확인 ────────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env 파일이 없습니다."
  echo "   cp k6/.env.example k6/.env 후 값을 채워주세요."
  exit 1
fi

mkdir -p "$RESULTS_DIR"

# ── 공통 docker run 함수 ──────────────────────────────────────
run_k6() {
  local script="$1"
  local out="$2"

  docker run --rm \
    -v "$SCRIPT_DIR:/scripts" \
    -v "$RESULTS_DIR:/results" \
    --env-file "$ENV_FILE" \
    grafana/k6 run "/scripts/$script" \
    --out "json=/results/$out"
}

# ── 실행 ──────────────────────────────────────────────────────
echo "============================================"
echo " MCP Server k6 Performance Test"
echo "============================================"
echo ""

echo "🚀 [1/2] Load Test 시작 (약 8분)..."
run_k6 "load-test.js" "load.json"

echo ""
echo "🚀 [2/2] Stress Test 시작 (약 6분)..."
run_k6 "stress-test.js" "stress.json"

echo ""
echo "============================================"
echo "✅ 완료!"
echo "   Load Test   → k6/results/load.json"
echo "   Stress Test → k6/results/stress.json"
echo "============================================"
