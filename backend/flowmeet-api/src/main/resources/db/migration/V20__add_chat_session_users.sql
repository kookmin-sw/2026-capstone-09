-- =========================================================
-- V20__add_chat_session_users.sql
-- 채팅 세션 참조 사용자 테이블
-- =========================================================

CREATE TABLE chat_session_users (
    chat_session_user_id BIGSERIAL PRIMARY KEY,
    chat_session_id      BIGINT    NOT NULL,
    user_id              BIGINT    NOT NULL,
    created_at           TIMESTAMP NOT NULL,
    CONSTRAINT fk_chat_session_users_session FOREIGN KEY (chat_session_id) REFERENCES chat_sessions (chat_session_id),
    CONSTRAINT fk_chat_session_users_user    FOREIGN KEY (user_id)         REFERENCES users (user_id),
    CONSTRAINT uk_chat_session_users         UNIQUE (chat_session_id, user_id)
);

CREATE INDEX idx_chat_session_users_chat_session_id ON chat_session_users (chat_session_id);
CREATE INDEX idx_chat_session_users_user_id          ON chat_session_users (user_id);