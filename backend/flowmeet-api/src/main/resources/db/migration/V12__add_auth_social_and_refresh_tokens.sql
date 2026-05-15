-- =========================================================
-- V12__add_auth_social_and_refresh_tokens.sql
-- 1) users: social_provider / google_refresh_token 컬럼 추가
--          + (social_provider, social_id) 유니크 제약으로 변경
-- 2) refresh_tokens 테이블 추가 (자체 발급 JWT refresh token 영속화)
-- =========================================================

-- ---------------------------------------------------------
-- users: social_provider 컬럼 추가
-- 기존 행은 모두 GOOGLE 로그인으로 가입된 상태이므로 GOOGLE 로 백필한다.
-- ---------------------------------------------------------
ALTER TABLE users ADD COLUMN social_provider VARCHAR(32);
UPDATE users SET social_provider = 'GOOGLE' WHERE social_provider IS NULL;
ALTER TABLE users ALTER COLUMN social_provider SET NOT NULL;

-- ---------------------------------------------------------
-- users: 구글 Calendar/Meet 연동을 위한 refresh token 보관 컬럼
-- 가입 시점에는 비어 있을 수 있고, 이후 동의 흐름에서 채워 넣는다.
-- ---------------------------------------------------------
ALTER TABLE users ADD COLUMN google_refresh_token VARCHAR(512);

-- ---------------------------------------------------------
-- users: 유니크 제약 교체
-- 동일 이메일이라도 provider 가 다르면 별개 계정이 될 수 있으므로
-- (social_provider, social_id) 조합으로 유일성을 보장한다.
-- ---------------------------------------------------------
ALTER TABLE users DROP CONSTRAINT uk_users_social_email;
ALTER TABLE users ADD CONSTRAINT uk_users_provider_social_id UNIQUE (social_provider, social_id);

-- ---------------------------------------------------------
-- refresh_tokens
-- 자체 발급 JWT refresh token 의 SHA-256 해시를 저장한다.
-- 회원당 다중 세션을 허용하고, 로그아웃/회수 시 row 단위로 삭제한다.
-- ---------------------------------------------------------
CREATE TABLE refresh_tokens (
    refresh_token_id BIGSERIAL    PRIMARY KEY,
    user_id          BIGINT       NOT NULL,
    token_hash       VARCHAR(255) NOT NULL,
    expires_at       TIMESTAMP    NOT NULL,
    created_at       TIMESTAMP    NOT NULL,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX uk_refresh_tokens_token_hash ON refresh_tokens (token_hash);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
