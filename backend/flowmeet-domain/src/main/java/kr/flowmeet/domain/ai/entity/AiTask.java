package kr.flowmeet.domain.ai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import kr.flowmeet.domain.common.BaseTimeEntity;
import kr.flowmeet.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ai_tasks")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AiTask extends BaseTimeEntity {

    @Id
    @Column(name = "ai_task_id")
    private String id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "reference_id", nullable = false)
    private Long referenceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AiTaskType taskType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AiTaskStatus status;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Builder
    public AiTask(String id, Long userId, Long projectId, Long referenceId, AiTaskType taskType) {
        this.id = id;
        this.userId = userId;
        this.projectId = projectId;
        this.referenceId = referenceId;
        this.taskType = taskType;
        this.status = AiTaskStatus.PENDING;
    }

    public void markProcessing() {
        this.status = AiTaskStatus.PROCESSING;
    }

    public void complete() {
        this.status = AiTaskStatus.COMPLETED;
    }

    public void fail(final String errorMessage) {
        this.status = AiTaskStatus.FAILED;
        this.errorMessage = errorMessage;
    }
}