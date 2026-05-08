-- =========================================================
-- V14__add_node_status_check.sql
-- nodes.status를 NodeStatus enum 값으로 제한
-- =========================================================

ALTER TABLE nodes
    ADD CONSTRAINT ck_nodes_status
    CHECK (status IN (
        'WAITING',
        'IN_PROGRESS',
        'ON_HOLD',
        'DONE',
        'CLOSED'
    ));
