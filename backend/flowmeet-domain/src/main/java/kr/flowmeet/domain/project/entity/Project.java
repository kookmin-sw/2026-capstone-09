package kr.flowmeet.domain.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import kr.flowmeet.domain.common.BaseSoftDeleteEntity;

@Entity
@Table(name = "projects")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE project_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Project extends BaseSoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "root_node_seq", nullable = false)
    private int rootNodeSeq;

    @Column(name = "last_activity_at")
    private LocalDateTime lastActivityAt;

    @Builder
    public Project(String name, String profileImageUrl) {
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.rootNodeSeq = 0;
    }

    public void updateName(final String name) {
        this.name = name;
    }

    public void updateProfileImageUrl(final String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public int issueRootNodeSeq() {
        this.rootNodeSeq += 1;
        return this.rootNodeSeq;
    }
}
