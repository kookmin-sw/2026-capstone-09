# FlowMeet Docker 배포 가이드

EC2 한 대 위에 `flowmeet-api` + `nginx`(리버스 프록시 + HTTPS) + `certbot`(Let's Encrypt)을
docker compose 로 올리는 구성이다. PostgreSQL 은 RDS 를 사용하므로 compose 에 포함하지 않는다.

```
 [ Client ] ──HTTPS──▶ [ nginx :443 ] ──http──▶ [ app :8080 ]
                           │                         │
                           └─ HTTP :80 (redirect)    └─ :8081 (actuator, 외부 미노출)
                                    ▲
                        certbot ─── webroot ──▶ /.well-known/acme-challenge
```

---

## 1. 파일 구성

| 경로 | 역할 |
| --- | --- |
| `Dockerfile` | `flowmeet-api` 멀티스테이지 빌드 (temurin 21, non-root) |
| `.dockerignore` | 빌드 컨텍스트 최소화 |
| `docker-compose.yml` | `app` / `nginx` / `certbot` 3 서비스 정의 |
| `.env.example` | 환경변수 템플릿 (실제 `.env` 는 EC2 에 직접 둔다) |
| `docker/nginx/nginx.conf` | nginx 전역 설정 |
| `docker/nginx/conf.d/app.conf.template` | 서버 블록 템플릿. `${DOMAIN}` 은 nginx 기동 시 `envsubst` 로 치환 |
| `docker/scripts/init-letsencrypt.sh` | 최초 인증서 발급 1회용 스크립트 |
| `docker/certbot/` | (자동 생성, gitignore) 인증서 / webroot 마운트 볼륨 |

---

## 2. 서비스 상세

### 2.1 `app` (flowmeet-api)

- 이미지: `${DOCKERHUB_USERNAME}/flowmeet-api:${IMAGE_TAG:-latest}` — 로컬/CI 에서 Docker Hub 로 푸시된 이미지를 pull
- 프로파일: `SPRING_PROFILES_ACTIVE=prod`
- 포트:
  - `8080` — 서비스 API. `expose` 로만 열어 같은 compose 네트워크 내에서 nginx 만 접근
  - `8081` — actuator(management) 포트. `expose` 조차 하지 않아 **같은 브리지 네트워크의 다른 컨테이너에서도 호출할 수 있지만 호스트/외부에는 바인딩되지 않는다**. nginx 는 이 포트로 프록시하지 않으므로 외부 접근 불가
- `env_file: .env` (optional) — RDS 접속 정보, JWT, OAuth, Mail, S3 비밀값 주입
- `healthcheck`: 컨테이너 내부에서 `wget http://localhost:8081/actuator/health` — Spring 이 DB/Flyway 까지 통과해야 healthy 가 됨
- `restart: unless-stopped`

### 2.2 `nginx`

- 이미지: `nginx:1.27-alpine`
- 포트: `80:80`, `443:443`
- 볼륨:
  - `./docker/nginx/nginx.conf` → `/etc/nginx/nginx.conf` (ro)
  - `./docker/nginx/conf.d` → `/etc/nginx/templates` (ro) — nginx 공식 이미지는 이 경로를 `envsubst` 로 렌더링해 `/etc/nginx/conf.d/` 에 복사
  - `./docker/certbot/conf` → `/etc/letsencrypt` (ro) — 발급된 인증서
  - `./docker/certbot/www` → `/var/www/certbot` (ro) — HTTP-01 챌린지 webroot
- 환경변수: `DOMAIN` — 템플릿의 `${DOMAIN}` 치환에 사용
- `command`: 6 시간마다 `nginx -s reload` 를 실행하는 백그라운드 루프 + foreground `nginx -g 'daemon off;'`. certbot 이 인증서를 갱신해도 파일만 바뀌고 메모리에 로드된 인증서는 그대로라, 주기적 reload 로 반영
- `depends_on: app (service_healthy)` — 앱이 healthy 되어야 nginx 가 기동. 부팅 초기 502 를 회피

### 2.3 `certbot`

- 이미지: `certbot/certbot:latest`
- 12 시간마다 `certbot renew` 를 돌리는 루프. 이미 발급된 상태에서만 의미가 있으므로, **최초 발급은 `init-letsencrypt.sh` 로 별도로 수행**한다
- 볼륨은 nginx 와 동일 (`conf`, `www`) 을 rw 로 마운트

---

## 3. 환경변수

프로젝트 루트에 `.env` 파일을 두면 compose 가 자동 로드한다. `.env.example` 을 복사해 채운다.

| 키 | 용도 | 비고 |
| --- | --- | --- |
| `DOCKERHUB_USERNAME` | 이미지 네임스페이스 | `username/flowmeet-api:tag` 조합 |
| `IMAGE_TAG` | 배포할 이미지 태그 | 미지정 시 `latest` |
| `DOMAIN` | 서비스 도메인 | 기본값 `api.flowmeet.kr` |
| `CERTBOT_EMAIL` | Let's Encrypt 알림 메일 | 인증서 만료 알림 수신 |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USERNAME` / `DB_PASSWORD` | RDS 접속 | `DB_PORT` 기본 5432 |
| `JWT_SECRET_KEY` | JWT 서명 키 | |
| `OAUTH2_GOOGLE_CLIENT_ID` / `OAUTH2_GOOGLE_CLIENT_SECRET` | Google OAuth2 | |
| `MAIL_*` | SMTP | 기본 smtp.gmail.com:587 |
| `S3_BUCKET` / `S3_REGION` / `S3_CDN_URL` | 이미지 업로드 | |
| `JAVA_OPTS` | JVM 옵션 | 기본 `-XX:MaxRAMPercentage=60.0 -XX:+ExitOnOutOfMemoryError` (t3.micro 기준) |

---

## 4. 최초 배포 절차 (EC2)

1. **사전**: Docker / docker compose 설치, 보안그룹 inbound **22 / 80 / 443** 오픈, DNS A 레코드 `api.flowmeet.kr → EC2 EIP`
2. `/opt/flowmeet/` 디렉토리에 `docker-compose.yml`, `docker/` 디렉토리 업로드
3. `/opt/flowmeet/.env` 작성 (`.env.example` 참고)
4. 이미지를 로컬/CI 에서 빌드·푸시 (현재 로컬 빌드 예시)
   ```bash
   docker build -t "$DOCKERHUB_USERNAME/flowmeet-api:latest" .
   docker push "$DOCKERHUB_USERNAME/flowmeet-api:latest"
   ```
5. EC2 에서 이미지 pull
   ```bash
   cd /opt/flowmeet
   docker compose pull app
   ```
6. **최초 인증서 발급 (1회)**
   ```bash
   ./docker/scripts/init-letsencrypt.sh
   ```
   실패 시 `STAGING=1` 로 두고 먼저 스테이징으로 검증 후 실제 발급.
7. 전체 기동
   ```bash
   docker compose up -d
   docker compose ps    # 모두 healthy / running 인지 확인
   ```
8. 접근 테스트
   ```bash
   curl -I http://api.flowmeet.kr              # 301
   curl    https://api.flowmeet.kr/swagger-ui/index.html
   ```

---

## 5. 운영

### 5.1 배포 (앱만 교체)

로컬/CI 에서 새 이미지 push 후 EC2 에서:

```bash
cd /opt/flowmeet
export IMAGE_TAG=$(git rev-parse --short HEAD)   # 또는 latest
docker compose pull app
docker compose up -d app
docker image prune -f
```

nginx 설정(템플릿)이나 compose 를 바꿨다면 `up -d` 로 변경된 서비스만 재생성된다.

### 5.2 인증서 갱신

- `certbot` 컨테이너가 12h 주기로 `renew` 실행 → 파일 갱신
- `nginx` 컨테이너가 6h 주기로 `reload` 실행 → 메모리에 반영
- 즉시 반영하려면:
  ```bash
  docker compose exec nginx nginx -s reload
  ```
- 강제 재발급:
  ```bash
  ./docker/scripts/init-letsencrypt.sh --force
  ```

### 5.3 로그

```bash
docker compose logs -f app
docker compose logs -f nginx
docker compose logs --tail=200 certbot
```

### 5.4 헬스체크 확인

호스트에서 직접 호출은 불가능 (8081 은 외부 미노출). 컨테이너 내부에서 확인한다.

```bash
docker compose exec app wget -qO- http://localhost:8081/actuator/health
# {"status":"UP"}
```

`docker compose ps` 의 STATUS 컬럼에 `healthy` 가 표시되면 정상.

---

## 6. 트러블슈팅

| 증상 | 원인 후보 | 조치 |
| --- | --- | --- |
| 초기 기동 후 502 | 앱이 아직 부팅 중 | `docker compose logs app` 로 Flyway migration / Hikari 초기화 완료 대기 |
| `/actuator/*` 외부 호출 시 404 | nginx 에서 차단 (`location /actuator { return 404; }`) | 의도된 동작 |
| 인증서 발급 실패 "Invalid response" | 80 포트 미개방 또는 DNS 미전파 | 보안그룹/DNS 확인 후 `--force` 재실행 |
| nginx 가 시작 안 됨 ("no such file … fullchain.pem") | `init-letsencrypt.sh` 미실행 | 더미 인증서 생성 포함된 init 스크립트 실행 |
| 앱이 `X-Forwarded-Proto` 를 신뢰하지 않음 | `forward-headers-strategy` 누락 | `application-prod.yaml` 에 `server.forward-headers-strategy: native` (설정 완료) |

---

## 7. 리소스 배분 (t3.micro 기준)

t3.micro: 물리 RAM 1GB + swap 1GB = 총 2GB

| 구성요소 | `mem_limit` | 실제 사용 예상 |
| --- | --- | --- |
| `app` | 800m | JVM 힙 480MB + 비힙 ~250MB = ~730MB |
| `nginx` | 64m | ~20~30MB |
| `certbot` | 128m | 평소 유휴, `renew` 시 일시적으로 ~80MB |
| OS + Docker 데몬 | (system) | ~150MB |

JVM 은 `MaxRAMPercentage=60.0` 으로 컨테이너 한계의 60% 를 힙으로 사용.
스왑은 버스트 시 안전망으로만 동작 — GC 가 스왑에 밀리면 pause 가 급증하므로
working set 은 물리 RAM 안에 머무르는 게 목표.

인스턴스 업그레이드 시 (예: t3.small = 2GB RAM)

```yaml
app:
  mem_limit: 1500m
```

정도로 올리고 `MaxRAMPercentage` 는 그대로 둬도 OK.

---

## 8. 보안 메모

- `.env` 는 절대 커밋하지 않는다 (`.gitignore` 로 차단). `.env.example` 만 커밋한다.
- actuator 는 management 포트(8081) 분리 + nginx `location /actuator { return 404; }` 이중 차단.
- nginx `server_tokens off;` 로 버전 노출 차단.
- TLS 는 Mozilla intermediate 수준(`ffdhe2048`) DH 파라미터 사용.
- docker 이미지 런타임은 non-root (`spring` 유저).
