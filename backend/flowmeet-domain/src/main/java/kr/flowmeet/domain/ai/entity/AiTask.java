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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AiTaskType taskType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AiTaskStatus status;

    @Column(columnDefinition = "TEXT")
    private String requestText;

    @Column(columnDefinition = "TEXT")
    private String result;

    @Column(columnDefinition = "TEXT")
    private String mermaidCode;

    private String errorMessage;

    @Builder
    public AiTask(String id, Long userId, AiTaskType taskType, String requestText) {
        this.id = id;
        this.userId = userId;
        this.taskType = taskType;
        this.status = AiTaskStatus.PENDING;
        this.requestText = requestText;
    }

    public void markProcessing() {
        this.status = AiTaskStatus.PROCESSING;
    }

    public void complete(final String result, final String mermaidCode) {
        this.status = AiTaskStatus.COMPLETED;
        this.result = result;
        this.mermaidCode = mermaidCode;
    }

    public void fail(final String errorMessage) {
        this.status = AiTaskStatus.FAILED;
        this.errorMessage = errorMessage;
    }
}