-- =========================================================
-- V10__add_external_event_id_to_meetings.sql
-- 화상 회의 제공자 외부 이벤트 ID 컬럼 추가
-- =========================================================

ALTER TABLE meetings
    ADD COLUMN external_event_id VARCHAR(255);
