-- ---------------------------------------------------------
-- meeting_transcripts
-- ---------------------------------------------------------
CREATE TABLE meeting_transcripts (
    transcript_id BIGSERIAL    PRIMARY KEY,
    meeting_id    BIGINT       NOT NULL,
    content       TEXT         NOT NULL,
    created_at    TIMESTAMP    NOT NULL,
    updated_at    TIMESTAMP    NOT NULL,
    CONSTRAINT fk_meeting_transcripts_meeting FOREIGN KEY (meeting_id) REFERENCES meetings (meeting_id)
);

CREATE INDEX idx_meeting_transcripts_meeting_id ON meeting_transcripts (meeting_id);