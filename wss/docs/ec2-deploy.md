# WSS EC2 배포 메뉴얼

## 사전 조건

- EC2 인스턴스 (Ubuntu 22.04 LTS, t3.micro 이상)
- 보안 그룹 인바운드: **22(SSH), 80(HTTP), 443(HTTPS)** 허용
- 도메인 DNS A 레코드가 이 EC2 퍼블릭 IP로 연결되어 있어야 함
- Docker, Docker Compose 설치 완료

---

## 1. EC2 접속

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

---

## 2. Docker 설치 (미설치 시)

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker
```

---

## 3. 배포 디렉토리 생성 및 .env 작성

```bash
mkdir -p /home/ubuntu/wss
cd /home/ubuntu/wss
```

`.env` 파일 생성 (`.env.example` 참고):

```bash
cat > .env <<'EOF'
PORT=1234
HOST=https://your-domain.com

DOMAIN=your-domain.com
CERTBOT_EMAIL=your-email@example.com

DOCKERHUB_USERNAME=your-dockerhub-username
IMAGE_TAG=latest
EOF
```

> `HOST` 와 `DOMAIN` 모두 실제 도메인으로 채운다.  
> `HOST` 는 Node.js 앱이 사용하는 공개 URL, `DOMAIN` 은 nginx / certbot 이 사용하는 도메인.

---

## 4. Docker Hub 로그인

```bash
docker login
```

---

## 5. nginx·certbot 설정 파일 배치

EC2에 `docker-compose.yml` 과 `docker/` 디렉토리가 없는 상태이므로 아래 두 방법 중 하나로 배치한다.

### 옵션 A — 레포 클론 후 복사 (빠름)

```bash
git clone https://github.com/<org>/<repo>.git /tmp/repo
cp /tmp/repo/wss/docker-compose.yml /home/ubuntu/wss/
cp -r /tmp/repo/wss/docker /home/ubuntu/wss/
rm -rf /tmp/repo
```

이후 6단계(인증서 발급)로 진행한다.

### 옵션 B — GitHub Actions workflow_dispatch 로 파일 수신

Actions 배포 워크플로우(`deploy-wss.yml`)가 SCP로 파일을 보내 주는 것을 이용한다.  
단, 워크플로우 마지막에 `docker compose up -d wss` 를 실행하므로 **`.env` 가 EC2에 먼저 있어야** 한다 (3단계 완료 후 진행).

**① GitHub Actions 수동 실행**

GitHub 레포 → Actions 탭 → `WSS CI/CD` → **Run workflow** (브랜치: `wss/develop`)

워크플로우가 완료되면 EC2에 다음이 준비된다:

```
/home/ubuntu/wss/
├── docker-compose.yml
├── docker/
│   ├── nginx/
│   └── scripts/
└── .env                  ← 3단계에서 직접 작성한 파일 (변경 없음)
```

`wss` 컨테이너는 이미 기동된 상태다.

**② 인증서 발급은 여전히 수동으로 진행 (6단계)**

Actions 은 `wss` 서비스만 올리고 nginx·certbot 은 올리지 않는다.  
SSH 로 재접속해 6단계부터 이어서 진행한다.

---

## 6. 최초 SSL 인증서 발급

```bash
cd /home/ubuntu/wss
chmod +x docker/scripts/init-letsencrypt.sh
./docker/scripts/init-letsencrypt.sh
```

스크립트가 하는 일:

1. 더미 self-signed 인증서 생성
2. nginx 를 80 포트로 기동해 HTTP-01 challenge 준비
3. 더미 인증서 제거
4. certbot 으로 Let's Encrypt 실제 인증서 발급
5. nginx reload

성공 시 출력:
```
완료. wss://your-domain.com 로 접근해 인증서를 확인하세요.
```

> DNS 전파가 덜 됐다면 발급에 실패한다. `nslookup your-domain.com` 으로 IP 가 맞는지 먼저 확인한다.

---

## 7. 전체 스택 기동

```bash
cd /home/ubuntu/wss
docker compose up -d
```

컨테이너 상태 확인:

```bash
docker compose ps
```

정상 상태:

```
NAME                  STATUS
flowmeet-wss          Up (healthy)
flowmeet-wss-nginx    Up
flowmeet-wss-certbot  Up
```

---

## 8. 동작 확인

브라우저 또는 wscat 으로 확인:

```bash
# wscat 설치
npm install -g wscat

# 연결 테스트 (룸 이름: test-room)
wscat -c wss://your-domain.com/test-room
```

nginx 로그:

```bash
docker compose logs -f nginx
```

WSS 앱 로그:

```bash
docker compose logs -f wss
```

---

## 9. GitHub Actions 시크릿 등록

| Secret 키 | 값 |
|---|---|
| `WSS_EC2_HOST` | EC2 퍼블릭 IP |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | EC2 SSH 프라이빗 키 전체 내용 |
| `DOCKERHUB_USERNAME` | Docker Hub 유저명 |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token |

등록 후 `wss/develop` 브랜치에 push 하면 자동 빌드·배포가 진행된다.

---

## 운영 커맨드

### 로그 실시간 확인
```bash
docker compose logs -f wss
docker compose logs -f nginx
```

### 서비스 재시작
```bash
docker compose restart wss
```

### 인증서 수동 갱신
```bash
docker compose run --rm certbot certbot renew
docker compose exec nginx nginx -s reload
```

### 인증서 만료일 확인
```bash
docker compose run --rm certbot certbot certificates
```

### 전체 서비스 중지
```bash
docker compose down
```

### 이미지·컨테이너 정리
```bash
docker image prune -f
```
