-- =========================================================
-- V3__add_unique_constraints.sql
-- 도메인 엔티티 unique 제약조건 추가
-- =========================================================

ALTER TABLE project_members
    ADD CONSTRAINT uk_project_members_project_id_user_id
    UNIQUE (project_id, user_id);

ALTER TABLE meeting_participants
    ADD CONSTRAINT uk_meeting_participants_meeting_id_user_id
    UNIQUE (meeting_id, user_id);

ALTER TABLE node_assignees
    ADD CONSTRAINT uk_node_assignees_node_id_user_id
    UNIQUE (node_id, user_id);

ALTER TABLE node_tags
    ADD CONSTRAINT uk_node_tags_node_id_tag_id
    UNIQUE (node_id, tag_id);

ALTER TABLE notification_settings
    ADD CONSTRAINT uk_notification_settings_user_id_project_id
    UNIQUE (user_id, project_id);

ALTER TABLE tags
    ADD CONSTRAINT uk_tags_project_id_name
    UNIQUE (project_id, name);

ALTER TABLE edges
    ADD CONSTRAINT uk_edges_project_start_end
    UNIQUE (project_id, start_node_id, end_node_id);
