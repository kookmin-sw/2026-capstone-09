-- =========================================================
-- V4__add_tag_color_check.sql
-- tags.color를 TagColor enum 값으로 제한
-- =========================================================

-- enum 값 외의 기존 데이터는 NEUTRAL로 정합화
UPDATE tags
SET color = 'NEUTRAL'
WHERE color NOT IN (
    'NEUTRAL',
    'RED',
    'RED_ORANGE',
    'ORANGE',
    'LIME',
    'GREEN',
    'CYAN',
    'LIGHT_BLUE',
    'BLUE',
    'VIOLET',
    'PURPLE',
    'PINK'
);

ALTER TABLE tags
    ADD CONSTRAINT ck_tags_color
    CHECK (color IN (
        'NEUTRAL',
        'RED',
        'RED_ORANGE',
        'ORANGE',
        'LIME',
        'GREEN',
        'CYAN',
        'LIGHT_BLUE',
        'BLUE',
        'VIOLET',
        'PURPLE',
        'PINK'
    ));
