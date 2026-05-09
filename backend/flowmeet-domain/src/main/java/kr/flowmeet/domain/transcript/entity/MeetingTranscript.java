package kr.flowmeet.domain.transcript.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import kr.flowmeet.domain.common.BaseTimeEntity;
import kr.flowmeet.domain.meeting.entity.Meeting;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "meeting_transcripts",
        indexes = {
                @Index(name = "idx_meeting_transcripts_meeting_id", columnList = "meeting_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MeetingTranscript extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transcript_id")
    private Long id;

    @Column(name = "meeting_id", nullable = false)
    private Long meetingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", insertable = false, updatable = false)
    private Meeting meeting;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder
    public MeetingTranscript(Long meetingId, String content) {
        this.meetingId = meetingId;
        this.content = content;
    }
}