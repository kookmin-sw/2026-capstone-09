-- =========================================================
-- V2__add_node_number.sql
-- 노드 계층 번호(#1.2.3 형태) 부여를 위한 컬럼 추가
-- =========================================================

-- nodes.number: materialized path 형태의 노드 번호
-- nodes.child_seq: 다음 자식에게 부여할 시퀀스 (1부터 증가)
ALTER TABLE nodes
    ADD COLUMN number    VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN child_seq INTEGER      NOT NULL DEFAULT 0;

-- projects.root_node_seq: 프로젝트 내 루트 노드에 부여할 다음 시퀀스
ALTER TABLE projects
    ADD COLUMN root_node_seq INTEGER NOT NULL DEFAULT 0;
