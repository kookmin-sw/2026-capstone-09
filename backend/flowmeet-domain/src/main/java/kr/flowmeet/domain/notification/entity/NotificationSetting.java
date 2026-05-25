package kr.flowmeet.domain.notification.entity;

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
import jakarta.persistence.UniqueConstraint;
import kr.flowmeet.domain.common.BaseTimeEntity;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "notification_settings",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_notification_settings_user_id_project_id", columnNames = { "user_id", "project_id" })
        },
        indexes = {
                @Index(name = "idx_notification_settings_user_id", columnList = "user_id"),
                @Index(name = "idx_notification_settings_project_id", columnList = "project_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationSetting extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_setting_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;

    @Column(name = "is_meeting_enabled", nullable = false)
    private boolean isMeetingEnabled;

    @Column(name = "is_node_enabled", nullable = false)
    private boolean isNodeEnabled;

    @Column(name = "is_desktop_enabled", nullable = false)
    private boolean isDesktopEnabled;

    @Column(name = "is_email_enabled", nullable = false)
    private boolean isEmailEnabled;

    @Builder
    public NotificationSetting(Long userId, Long projectId) {
        this.userId = userId;
        this.projectId = projectId;
        this.isMeetingEnabled = true;
        this.isNodeEnabled = true;
        this.isDesktopEnabled = true;
        this.isEmailEnabled = false;
    }

    public void update(final boolean isMeetingEnabled, final boolean isNodeEnabled,
                       final boolean isDesktopEnabled, final boolean isEmailEnabled) {
        this.isMeetingEnabled = isMeetingEnabled;
        this.isNodeEnabled = isNodeEnabled;
        this.isDesktopEnabled = isDesktopEnabled;
        this.isEmailEnabled = isEmailEnabled;
    }
}
