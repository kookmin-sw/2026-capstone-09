package kr.flowmeet.domain.node.entity;

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
        name = "edges",
        indexes = {
                @Index(name = "idx_edges_project_id", columnList = "project_id"),
                @Index(name = "idx_edges_start_node_id", columnList = "start_node_id"),
                @Index(name = "idx_edges_end_node_id", columnList = "end_node_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE edges SET deleted_at = CURRENT_TIMESTAMP WHERE edge_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Edge extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "edge_id")
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;

    @Column(name = "start_node_id", nullable = false)
    private Long startNodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "start_node_id", insertable = false, updatable = false)
    private Node startNode;

    @Column(name = "end_node_id", nullable = false)
    private Long endNodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "end_node_id", insertable = false, updatable = false)
    private Node endNode;

    @Column(name = "created_by", nullable = false)
    private Long createdById;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User createdBy;

    private String comment;

    @Builder
    public Edge(Long projectId, Long startNodeId, Long endNodeId, Long createdById, String comment) {
        this.projectId = projectId;
        this.startNodeId = startNodeId;
        this.endNodeId = endNodeId;
        this.createdById = createdById;
        this.comment = comment;
    }

    public void update(final Long startNodeId, final Long endNodeId) {
        this.startNodeId = startNodeId;
        this.endNodeId = endNodeId;
    }
}
