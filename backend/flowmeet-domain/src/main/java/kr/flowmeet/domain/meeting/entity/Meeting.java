package kr.flowmeet.domain.meeting.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import kr.flowmeet.domain.common.BaseSoftDeleteEntity;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
        name = "meetings",
        indexes = {
                @Index(name = "idx_meetings_node_id", columnList = "node_id"),
                @Index(name = "idx_meetings_created_by", columnList = "created_by")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE meetings SET deleted_at = CURRENT_TIMESTAMP WHERE meeting_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Meeting extends BaseSoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_id")
    private Long id;

    @Column(name = "node_id", nullable = false)
    private Long nodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "node_id", insertable = false, updatable = false)
    private Node node;

    @Column(name = "created_by", nullable = false)
    private Long createdById;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingStatus status;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "is_push_enabled", nullable = false)
    private boolean isPushEnabled;

    @Column(name = "push_notify_at")
    private LocalDateTime pushNotifyAt;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "reminder_sent", nullable = false)
    private boolean reminderSent;

    @Column(name = "meeting_url")
    private String meetingUrl;

    @Column(name = "external_event_id")
    private String externalEventId;

    @Builder
    public Meeting(Long nodeId, Long createdById, MeetingStatus status,
                   LocalDateTime startedAt, boolean isPushEnabled, LocalDateTime pushNotifyAt,
                   String summary, String meetingUrl, String externalEventId) {
        this.nodeId = nodeId;
        this.createdById = createdById;
        this.status = status;
        this.startedAt = startedAt;
        this.isPushEnabled = isPushEnabled;
        this.pushNotifyAt = pushNotifyAt;
        this.summary = summary;
        this.reminderSent = false;
        this.meetingUrl = meetingUrl;
        this.externalEventId = externalEventId;
    }

    public void updateSchedule(final LocalDateTime startedAt, final LocalDateTime pushNotifyAt) {
        this.pushNotifyAt = pushNotifyAt;

        if (this.startedAt != null && this.startedAt.isEqual(startedAt)) {
            return;
        }

        this.startedAt = startedAt;
        this.reminderSent = false;
    }

    public boolean isCreatedBy(final Long userId) {
        return this.createdById.equals(userId);
    }

    public boolean isInProgress() {
        return this.status == MeetingStatus.IN_PROGRESS;
    }

    public boolean isScheduled() {
        return this.status == MeetingStatus.SCHEDULED;
    }

    public void updatePushEnabled(boolean isPushEnabled) {
        this.isPushEnabled = isPushEnabled;
    }
}
