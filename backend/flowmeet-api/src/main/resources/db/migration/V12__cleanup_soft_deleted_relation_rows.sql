-- =========================================================
-- V12__cleanup_soft_deleted_relation_rows.sql
-- 관계 테이블 hard delete 전환에 따른 기존 soft-deleted 행 정리
-- =========================================================

DELETE FROM node_assignees WHERE deleted_at IS NOT NULL;
DELETE FROM project_members WHERE deleted_at IS NOT NULL;
DELETE FROM meeting_participants WHERE deleted_at IS NOT NULL;
DELETE FROM edges WHERE deleted_at IS NOT NULL;