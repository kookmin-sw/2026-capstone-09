package kr.flowmeet.domain.chat.entity;

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
import kr.flowmeet.domain.common.BaseSoftDeleteEntity;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
        name = "chat_sessions",
        indexes = {
                @Index(name = "idx_chat_sessions_project_id", columnList = "project_id"),
                @Index(name = "idx_chat_sessions_created_by", columnList = "created_by")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE chat_sessions SET deleted_at = CURRENT_TIMESTAMP WHERE chat_session_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ChatSession extends BaseSoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_session_id")
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;

    @Column(name = "created_by", nullable = false)
    private Long createdById;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User createdBy;

    @Column(nullable = false)
    private String title;

    @Builder
    public ChatSession(Long projectId, Long createdById, String title) {
        this.projectId = projectId;
        this.createdById = createdById;
        this.title = title;
    }

    public boolean isCreatedBy(final Long userId) {
        return this.createdById.equals(userId);
    }

    public void updateTitle(final String title) {
        this.title = title;
    }
}