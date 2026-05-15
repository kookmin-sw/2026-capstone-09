# syntax=docker/dockerfile:1.7

# ---------- Stage 1: Build ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /workspace

# Gradle wrapper + 루트 빌드 스크립트 먼저 복사 (의존성 레이어 캐시 활용)
COPY gradlew ./
COPY gradle ./gradle
COPY settings.gradle build.gradle ./

# 각 모듈의 build.gradle만 먼저 복사 (소스 변경 시에도 의존성 캐시 유지)
COPY flowmeet-api/build.gradle           flowmeet-api/
COPY flowmeet-auth/build.gradle          flowmeet-auth/
COPY flowmeet-common/build.gradle        flowmeet-common/
COPY flowmeet-domain/build.gradle        flowmeet-domain/
COPY flowmeet-external/build.gradle      flowmeet-external/
COPY flowmeet-global-utils/build.gradle  flowmeet-global-utils/

RUN chmod +x gradlew && ./gradlew --no-daemon :flowmeet-api:dependencies

# 소스 복사 후 bootJar
COPY flowmeet-api/src           flowmeet-api/src
COPY flowmeet-auth/src          flowmeet-auth/src
COPY flowmeet-common/src        flowmeet-common/src
COPY flowmeet-domain/src        flowmeet-domain/src
COPY flowmeet-external/src      flowmeet-external/src
COPY flowmeet-global-utils/src  flowmeet-global-utils/src

RUN ./gradlew --no-daemon :flowmeet-api:bootJar -x test

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

RUN groupadd --system spring && useradd --system --gid spring spring
USER spring

COPY --from=builder /workspace/flowmeet-api/build/libs/flowmeet-api.jar /app/app.jar

ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080 8081

ENTRYPOINT ["sh", "-c", "exec java -jar /app/app.jar"]
