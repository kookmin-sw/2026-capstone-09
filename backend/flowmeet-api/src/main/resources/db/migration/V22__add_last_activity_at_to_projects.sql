-- =========================================================
-- V22__add_last_activity_at_to_projects.sql
-- 프로젝트 하위 항목 변경 시 반영되는 마지막 활동 시각 컬럼 추가
-- =========================================================

ALTER TABLE projects
    ADD COLUMN last_activity_at TIMESTAMP;

UPDATE projects
SET last_activity_at = updated_at;
