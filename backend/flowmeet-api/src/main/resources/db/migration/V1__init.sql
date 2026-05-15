-- =========================================================
-- V1__init.sql
-- FlowMeet 초기 스키마
-- =========================================================

-- ---------------------------------------------------------
-- users
-- ---------------------------------------------------------
CREATE TABLE users (
    user_id           BIGSERIAL    PRIMARY KEY,
    social_email      VARCHAR(255) NOT NULL,
    email             VARCHAR(255) NOT NULL,
    social_id         VARCHAR(255) NOT NULL,
    nickname          VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(255),
    created_at        TIMESTAMP    NOT NULL,
    updated_at        TIMESTAMP    NOT NULL,
    deleted_at        TIMESTAMP,
    CONSTRAINT uk_users_social_email UNIQUE (social_email),
    CONSTRAINT uk_users_email        UNIQUE (email)
);

-- ---------------------------------------------------------
-- projects
-- ---------------------------------------------------------
CREATE TABLE projects (
    project_id        BIGSERIAL    PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(255),
    created_at        TIMESTAMP    NOT NULL,
    updated_at        TIMESTAMP    NOT NULL,
    deleted_at        TIMESTAMP
);

-- ---------------------------------------------------------
-- project_members
-- ---------------------------------------------------------
CREATE TABLE project_members (
    project_member_id BIGSERIAL    PRIMARY KEY,
    project_id        BIGINT       NOT NULL,
    user_id           BIGINT       NOT NULL,
    role              VARCHAR(255) NOT NULL,
    created_at        TIMESTAMP    NOT NULL,
    updated_at        TIMESTAMP    NOT NULL,
    deleted_at        TIMESTAMP,
    CONSTRAINT fk_project_members_project FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_project_members_user    FOREIGN KEY (user_id)    REFERENCES users (user_id)
);

CREATE INDEX idx_project_members_project_id ON project_members (project_id);
CREATE INDEX idx_project_members_user_id    ON project_members (user_id);

-- ---------------------------------------------------------
-- project_urls
-- ---------------------------------------------------------
CREATE TABLE project_urls (
    project_url_id BIGSERIAL PRIMARY KEY,
    project_id     BIGINT    NOT NULL,
    url            TEXT      NOT NULL,
    created_at     TIMESTAMP NOT NULL,
    updated_at     TIMESTAMP NOT NULL,
    deleted_at     TIMESTAMP,
    CONSTRAINT fk_project_urls_project FOREIGN KEY (project_id) REFERENCES projects (project_id)
);

CREATE INDEX idx_project_urls_project_id ON project_urls (project_id);

-- ---------------------------------------------------------
-- nodes
-- ---------------------------------------------------------
CREATE TABLE nodes (
    node_id      BIGSERIAL    PRIMARY KEY,
    project_id   BIGINT       NOT NULL,
    parent_id    BIGINT,
    title        VARCHAR(255) NOT NULL,
    description  VARCHAR(255),
    type         VARCHAR(255) NOT NULL,
    note_content TEXT,
    status       VARCHAR(255) NOT NULL,
    sort_order   INTEGER      NOT NULL,
    created_at   TIMESTAMP    NOT NULL,
    updated_at   TIMESTAMP    NOT NULL,
    deleted_at   TIMESTAMP,
    CONSTRAINT fk_nodes_project FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_nodes_parent  FOREIGN KEY (parent_id)  REFERENCES nodes (node_id)
);

CREATE INDEX idx_nodes_project_id ON nodes (project_id);
CREATE INDEX idx_nodes_parent_id  ON nodes (parent_id);

-- ---------------------------------------------------------
-- edges
-- ---------------------------------------------------------
CREATE TABLE edges (
    edge_id       BIGSERIAL PRIMARY KEY,
    project_id    BIGINT    NOT NULL,
    start_node_id BIGINT    NOT NULL,
    end_node_id   BIGINT    NOT NULL,
    created_by    BIGINT    NOT NULL,
    comment       VARCHAR(255),
    created_at    TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP NOT NULL,
    deleted_at    TIMESTAMP,
    CONSTRAINT fk_edges_project    FOREIGN KEY (project_id)    REFERENCES projects (project_id),
    CONSTRAINT fk_edges_start_node FOREIGN KEY (start_node_id) REFERENCES nodes (node_id),
    CONSTRAINT fk_edges_end_node   FOREIGN KEY (end_node_id)   REFERENCES nodes (node_id),
    CONSTRAINT fk_edges_created_by FOREIGN KEY (created_by)    REFERENCES users (user_id)
);

CREATE INDEX idx_edges_project_id    ON edges (project_id);
CREATE INDEX idx_edges_start_node_id ON edges (start_node_id);
CREATE INDEX idx_edges_end_node_id   ON edges (end_node_id);

-- ---------------------------------------------------------
-- node_assignees
-- ---------------------------------------------------------
CREATE TABLE node_assignees (
    node_assignee_id BIGSERIAL PRIMARY KEY,
    node_id          BIGINT    NOT NULL,
    user_id          BIGINT    NOT NULL,
    created_at       TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP NOT NULL,
    deleted_at       TIMESTAMP,
    CONSTRAINT fk_node_assignees_node FOREIGN KEY (node_id) REFERENCES nodes (node_id),
    CONSTRAINT fk_node_assignees_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE INDEX idx_node_assignees_node_id ON node_assignees (node_id);
CREATE INDEX idx_node_assignees_user_id ON node_assignees (user_id);

-- ---------------------------------------------------------
-- tags
-- ---------------------------------------------------------
CREATE TABLE tags (
    tag_id     BIGSERIAL   PRIMARY KEY,
    project_id BIGINT      NOT NULL,
    name       VARCHAR(50) NOT NULL,
    color      VARCHAR(20) NOT NULL,
    created_at TIMESTAMP   NOT NULL,
    updated_at TIMESTAMP   NOT NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_tags_project FOREIGN KEY (project_id) REFERENCES projects (project_id)
);

CREATE INDEX idx_tags_project_id ON tags (project_id);

-- ---------------------------------------------------------
-- node_tags
-- ---------------------------------------------------------
CREATE TABLE node_tags (
    node_tag_id BIGSERIAL PRIMARY KEY,
    tag_id      BIGINT    NOT NULL,
    node_id     BIGINT    NOT NULL,
    CONSTRAINT fk_node_tags_tag  FOREIGN KEY (tag_id)  REFERENCES tags (tag_id),
    CONSTRAINT fk_node_tags_node FOREIGN KEY (node_id) REFERENCES nodes (node_id)
);

CREATE INDEX idx_node_tags_tag_id  ON node_tags (tag_id);
CREATE INDEX idx_node_tags_node_id ON node_tags (node_id);

-- ---------------------------------------------------------
-- meetings
-- ---------------------------------------------------------
CREATE TABLE meetings (
    meeting_id      BIGSERIAL    PRIMARY KEY,
    node_id         BIGINT       NOT NULL,
    created_by      BIGINT       NOT NULL,
    status          VARCHAR(255) NOT NULL,
    started_at      TIMESTAMP,
    is_push_enabled BOOLEAN      NOT NULL,
    summary         TEXT,
    created_at      TIMESTAMP    NOT NULL,
    updated_at      TIMESTAMP    NOT NULL,
    deleted_at      TIMESTAMP,
    CONSTRAINT fk_meetings_node       FOREIGN KEY (node_id)    REFERENCES nodes (node_id),
    CONSTRAINT fk_meetings_created_by FOREIGN KEY (created_by) REFERENCES users (user_id)
);

CREATE INDEX idx_meetings_node_id    ON meetings (node_id);
CREATE INDEX idx_meetings_created_by ON meetings (created_by);

-- ---------------------------------------------------------
-- meeting_participants
-- ---------------------------------------------------------
CREATE TABLE meeting_participants (
    meeting_participant_id BIGSERIAL PRIMARY KEY,
    meeting_id             BIGINT    NOT NULL,
    user_id                BIGINT    NOT NULL,
    created_at             TIMESTAMP NOT NULL,
    updated_at             TIMESTAMP NOT NULL,
    deleted_at             TIMESTAMP,
    CONSTRAINT fk_meeting_participants_meeting FOREIGN KEY (meeting_id) REFERENCES meetings (meeting_id),
    CONSTRAINT fk_meeting_participants_user    FOREIGN KEY (user_id)    REFERENCES users (user_id)
);

CREATE INDEX idx_meeting_participants_meeting_id ON meeting_participants (meeting_id);
CREATE INDEX idx_meeting_participants_user_id    ON meeting_participants (user_id);

-- ---------------------------------------------------------
-- notifications
-- ---------------------------------------------------------
CREATE TABLE notifications (
    notification_id BIGSERIAL    PRIMARY KEY,
    user_id         BIGINT       NOT NULL,
    type            VARCHAR(255) NOT NULL,
    content         VARCHAR(255) NOT NULL,
    project_id      BIGINT       NOT NULL,
    node_id         BIGINT,
    is_read         BOOLEAN      NOT NULL,
    created_at      TIMESTAMP    NOT NULL,
    CONSTRAINT fk_notifications_user    FOREIGN KEY (user_id)    REFERENCES users (user_id),
    CONSTRAINT fk_notifications_project FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_notifications_node    FOREIGN KEY (node_id)    REFERENCES nodes (node_id)
);

CREATE INDEX idx_notifications_user_id    ON notifications (user_id);
CREATE INDEX idx_notifications_project_id ON notifications (project_id);
CREATE INDEX idx_notifications_node_id    ON notifications (node_id);

-- ---------------------------------------------------------
-- notification_settings
-- ---------------------------------------------------------
CREATE TABLE notification_settings (
    notification_setting_id BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT    NOT NULL,
    project_id              BIGINT    NOT NULL,
    is_meeting_enabled      BOOLEAN   NOT NULL,
    is_node_enabled         BOOLEAN   NOT NULL,
    is_desktop_enabled      BOOLEAN   NOT NULL,
    is_email_enabled        BOOLEAN   NOT NULL,
    created_at              TIMESTAMP NOT NULL,
    updated_at              TIMESTAMP NOT NULL,
    deleted_at              TIMESTAMP,
    CONSTRAINT fk_notification_settings_user    FOREIGN KEY (user_id)    REFERENCES users (user_id),
    CONSTRAINT fk_notification_settings_project FOREIGN KEY (project_id) REFERENCES projects (project_id)
);

CREATE INDEX idx_notification_settings_user_id    ON notification_settings (user_id);
CREATE INDEX idx_notification_settings_project_id ON notification_settings (project_id);

-- ---------------------------------------------------------
-- file_information
-- ---------------------------------------------------------
CREATE TABLE file_information (
    file_id      BIGSERIAL    PRIMARY KEY,
    file_key     VARCHAR(255) NOT NULL,
    name         VARCHAR(255) NOT NULL,
    extension    VARCHAR(20)  NOT NULL,
    size         BIGINT       NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    domain_type  VARCHAR(255) NOT NULL,
    entity_id    BIGINT,
    upload_url   TEXT         NOT NULL,
    created_at   TIMESTAMP    NOT NULL,
    CONSTRAINT uk_file_information_file_key UNIQUE (file_key)
);

CREATE INDEX idx_file_information_domain_entity ON file_information (domain_type, entity_id);
