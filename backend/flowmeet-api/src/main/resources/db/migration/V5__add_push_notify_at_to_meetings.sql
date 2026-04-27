-- =========================================================
-- V5__add_push_notify_at_to_meetings.sql
-- 회의 푸시 알림 예약 시각 컬럼 추가
-- =========================================================

ALTER TABLE meetings
    ADD COLUMN push_notify_at TIMESTAMP;