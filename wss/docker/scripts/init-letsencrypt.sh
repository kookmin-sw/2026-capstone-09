#!/bin/bash
# Let's Encrypt 최초 인증서 발급 스크립트.
#
# 동작 순서
#   1) 더미 self-signed 인증서 생성 → nginx 가 일단 뜰 수 있게 함
#   2) nginx 기동 (80 포트 오픈, /.well-known/acme-challenge/ 서빙)
#   3) 더미 인증서 제거
#   4) certbot 로 실제 인증서 발급
#   5) nginx reload
#
# 사전 조건
#   - .env 파일에 DOMAIN, CERTBOT_EMAIL 이 채워져 있어야 한다
#   - 이 호스트(EC2) 80 포트로 ${DOMAIN} 이 DNS 상 연결되어 있어야 한다
#
# 사용법: ./docker/scripts/init-letsencrypt.sh
# 재발급/강제 갱신: ./docker/scripts/init-letsencrypt.sh --force

set -euo pipefail

cd "$(dirname "$0")/../.."

if [ ! -f .env ]; then
  echo ".env 파일이 없습니다. 프로젝트 루트에 .env 를 먼저 만들어 주세요." >&2
  exit 1
fi

# .env 로드
set -a
# shellcheck disable=SC1091
source .env
set +a

: "${DOMAIN:?DOMAIN 환경변수가 .env 에 설정되어야 합니다}"
: "${CERTBOT_EMAIL:?CERTBOT_EMAIL 환경변수가 .env 에 설정되어야 합니다}"

FORCE="${1:-}"

DATA_PATH="./docker/certbot"
STAGING=0   # 1 로 바꾸면 Let's Encrypt 스테이징 환경 사용 (rate limit 회피)

# 이미 인증서가 있으면 기본적으로 스킵
if [ -d "$DATA_PATH/conf/live/$DOMAIN" ] && [ "$FORCE" != "--force" ]; then
  echo "이미 $DOMAIN 인증서가 존재합니다. 재발급하려면 --force 옵션을 붙여 주세요."
  exit 0
fi

# 권장 nginx TLS 옵션 / DH 파라미터 내려받기 (certbot 공식)
if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ] || [ ! -e "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
  echo "### 권장 TLS 파라미터 다운로드"
  mkdir -p "$DATA_PATH/conf"
  curl -fsSL https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
    > "$DATA_PATH/conf/options-ssl-nginx.conf"
  curl -fsSL https://ssl-config.mozilla.org/ffdhe2048.txt \
    > "$DATA_PATH/conf/ssl-dhparams.pem"
fi

echo "### 더미 인증서 생성 ($DOMAIN)"
path="/etc/letsencrypt/live/$DOMAIN"
mkdir -p "$DATA_PATH/conf/live/$DOMAIN"

docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:4096 -days 1 \
    -keyout '$path/privkey.pem' \
    -out    '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "### nginx 기동"
docker compose up --force-recreate -d nginx

echo "### 더미 인증서 제거"
docker compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$DOMAIN && \
  rm -Rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -Rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

echo "### Let's Encrypt 인증서 발급 요청"
staging_arg=""
if [ $STAGING -ne 0 ]; then staging_arg="--staging"; fi

docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    --email $CERTBOT_EMAIL \
    -d $DOMAIN \
    --rsa-key-size 4096 \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

echo "### nginx reload"
docker compose exec nginx nginx -s reload

echo "완료. wss://$DOMAIN 로 접근해 인증서를 확인하세요."
