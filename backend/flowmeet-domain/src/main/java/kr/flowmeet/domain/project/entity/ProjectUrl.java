package kr.flowmeet.domain.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import kr.flowmeet.domain.common.BaseTimeEntity;

@Entity
@Table(name = "project_urls")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE project_urls SET deleted_at = CURRENT_TIMESTAMP WHERE project_url_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ProjectUrl extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_url_id")
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Builder
    public ProjectUrl(Long projectId, String url) {
        this.projectId = projectId;
        this.url = url;
    }

    public void updateUrl(final String url) {
        this.url = url;
    }
}
