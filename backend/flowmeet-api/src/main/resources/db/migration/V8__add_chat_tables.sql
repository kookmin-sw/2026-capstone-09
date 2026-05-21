-- =========================================================
-- V8__add_chat_tables.sql
-- 채팅 세션, 메시지, 참조 노드 테이블
-- =========================================================

-- ---------------------------------------------------------
-- chat_sessions
-- ---------------------------------------------------------
CREATE TABLE chat_sessions (
    chat_session_id BIGSERIAL    PRIMARY KEY,
    project_id      BIGINT       NOT NULL,
    created_by      BIGINT       NOT NULL,
    title           VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP    NOT NULL,
    updated_at      TIMESTAMP    NOT NULL,
    deleted_at      TIMESTAMP,
    CONSTRAINT fk_chat_sessions_project FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_chat_sessions_user    FOREIGN KEY (created_by) REFERENCES users (user_id)
);

CREATE INDEX idx_chat_sessions_project_id ON chat_sessions (project_id);
CREATE INDEX idx_chat_sessions_created_by ON chat_sessions (created_by);

-- ---------------------------------------------------------
-- chat_messages
-- ---------------------------------------------------------
CREATE TABLE chat_messages (
    chat_message_id BIGSERIAL    PRIMARY KEY,
    chat_session_id BIGINT       NOT NULL,
    content         TEXT         NOT NULL,
    message_type    VARCHAR(50)  NOT NULL,
    action_data     TEXT,
    created_at      TIMESTAMP    NOT NULL,
    updated_at      TIMESTAMP    NOT NULL,
    deleted_at      TIMESTAMP,
    CONSTRAINT fk_chat_messages_session FOREIGN KEY (chat_session_id) REFERENCES chat_sessions (chat_session_id)
);

CREATE INDEX idx_chat_messages_chat_session_id ON chat_messages (chat_session_id);

-- ---------------------------------------------------------
-- chat_session_nodes
-- ---------------------------------------------------------
CREATE TABLE chat_session_nodes (
    chat_session_node_id BIGSERIAL PRIMARY KEY,
    chat_session_id      BIGINT    NOT NULL,
    node_id              BIGINT    NOT NULL,
    created_at           TIMESTAMP NOT NULL,
    CONSTRAINT fk_chat_session_nodes_session FOREIGN KEY (chat_session_id) REFERENCES chat_sessions (chat_session_id),
    CONSTRAINT fk_chat_session_nodes_node    FOREIGN KEY (node_id)         REFERENCES nodes (node_id),
    CONSTRAINT uk_chat_session_nodes         UNIQUE (chat_session_id, node_id)
);

CREATE INDEX idx_chat_session_nodes_chat_session_id ON chat_session_nodes (chat_session_id);
CREATE INDEX idx_chat_session_nodes_node_id          ON chat_session_nodes (node_id);