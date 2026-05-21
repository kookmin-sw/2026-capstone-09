-- =========================================================
-- V9__add_meeting_url_to_meetings.sql
-- 회의 화상 회의 링크 컬럼 추가
-- =========================================================

ALTER TABLE meetings
    ADD COLUMN meeting_url VARCHAR(2048);
