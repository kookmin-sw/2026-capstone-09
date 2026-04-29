ALTER TABLE notifications DROP COLUMN node_id;
ALTER TABLE notifications ADD COLUMN target_id BIGINT;

ALTER TABLE meetings ADD COLUMN reminder_sent BOOLEAN NOT NULL DEFAULT FALSE;