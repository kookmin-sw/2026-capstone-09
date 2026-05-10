-- ---------------------------------------------------------
-- ai_tasks
-- ---------------------------------------------------------
CREATE TABLE ai_tasks (
    ai_task_id   VARCHAR(36)  PRIMARY KEY,
    user_id      BIGINT       NOT NULL,
    reference_id BIGINT       NOT NULL,
    task_type    VARCHAR(50)  NOT NULL,
    status       VARCHAR(50)  NOT NULL,
    result       TEXT,
    mermaid_code TEXT,
    error_message VARCHAR(500),
    created_at   TIMESTAMP    NOT NULL,
    updated_at   TIMESTAMP    NOT NULL,
    CONSTRAINT fk_ai_tasks_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE INDEX idx_ai_tasks_user_id      ON ai_tasks (user_id);
CREATE INDEX idx_ai_tasks_reference_id ON ai_tasks (reference_id);