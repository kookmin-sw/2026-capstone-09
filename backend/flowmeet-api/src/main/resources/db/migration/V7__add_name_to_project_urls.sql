-- =========================================================
-- V7__add_name_to_project_urls.sql
-- 프로젝트 URL 라벨(name) 컬럼 추가
-- =========================================================

ALTER TABLE project_urls
    ADD COLUMN name TEXT NOT NULL DEFAULT '';

ALTER TABLE project_urls
    ALTER COLUMN name DROP DEFAULT;
