-- =========================================================
-- V21__add_project_id_to_ai_tasks.sql
-- ai_tasks에 project_id 컬럼 추가
-- =========================================================

ALTER TABLE ai_tasks
    ADD COLUMN project_id BIGINT NOT NULL DEFAULT 0;

ALTER TABLE ai_tasks
    ALTER COLUMN project_id DROP DEFAULT;

ALTER TABLE ai_tasks
    ADD CONSTRAINT fk_ai_tasks_project FOREIGN KEY (project_id) REFERENCES projects (project_id) NOT VALID;

CREATE INDEX idx_ai_tasks_project_id ON ai_tasks (project_id);