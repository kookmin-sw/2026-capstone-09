-- =========================================================
-- V11__add_email_verifications.sql
-- 이메일 인증 코드 보관 테이블
-- =========================================================

CREATE TABLE email_verifications (
    email_verification_id BIGSERIAL    PRIMARY KEY,
    user_id               BIGINT       NOT NULL,
    email                 VARCHAR(255) NOT NULL,
    code                  VARCHAR(10)  NOT NULL,
    expires_at            TIMESTAMP    NOT NULL,
    verified_at           TIMESTAMP,
    created_at            TIMESTAMP    NOT NULL,
    CONSTRAINT fk_email_verifications_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE INDEX idx_email_verifications_user_id_email ON email_verifications (user_id, email);
