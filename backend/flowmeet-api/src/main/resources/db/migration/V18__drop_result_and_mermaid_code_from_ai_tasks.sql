-- ---------------------------------------------------------
-- V18__drop_result_and_mermaid_code_from_ai_tasks.sql
-- ---------------------------------------------------------
ALTER TABLE ai_tasks DROP COLUMN result;
ALTER TABLE ai_tasks DROP COLUMN mermaid_code;