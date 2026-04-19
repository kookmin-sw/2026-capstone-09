package kr.flowmeet.domain.node.entity;

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
import kr.flowmeet.domain.common.BaseTimeEntity;
import kr.flowmeet.domain.project.entity.Project;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
        name = "nodes",
        indexes = {
                @Index(name = "idx_nodes_project_id", columnList = "project_id"),
                @Index(name = "idx_nodes_parent_id", columnList = "parent_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE nodes SET deleted_at = CURRENT_TIMESTAMP WHERE node_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Node extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "node_id")
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;

    @Column(name = "parent_id")
    private Long parentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    private Node parent;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NodeType type;

    @Column(name = "note_content", columnDefinition = "TEXT")
    private String noteContent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NodeStatus status;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Builder
    public Node(Long projectId, Long parentId, String title, String description, NodeType type,
                String noteContent, NodeStatus status, int sortOrder) {
        this.projectId = projectId;
        this.parentId = parentId;
        this.title = title;
        this.description = description;
        this.type = type;
        this.noteContent = noteContent;
        this.status = status;
        this.sortOrder = sortOrder;
    }

    public void update(final String title, final String description, final String noteContent,
                       final NodeStatus status, final Integer sortOrder) {
        this.title = title;
        this.description = description;
        this.noteContent = noteContent;
        this.status = status;
        this.sortOrder = sortOrder;
    }

    public void updateStatus(final NodeStatus status, final int sortOrder) {
        this.status = status;
        this.sortOrder = sortOrder;
    }

}
