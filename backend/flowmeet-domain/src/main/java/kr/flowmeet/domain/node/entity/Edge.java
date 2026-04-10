package kr.flowmeet.domain.node.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "edges")
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

    @Column(name = "comment_author_id", nullable = false)
    private Long commentAuthorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_author_id", insertable = false, updatable = false)
    private User commentAuthor;

    @Enumerated(EnumType.STRING)
    @Column(name = "line_type", nullable = false)
    private EdgeLineType lineType;

    private String comment;

    @Builder
    public Edge(Long projectId, Long startNodeId, Long endNodeId, Long createdById,
                Long commentAuthorId, EdgeLineType lineType, String comment) {
        this.projectId = projectId;
        this.startNodeId = startNodeId;
        this.endNodeId = endNodeId;
        this.createdById = createdById;
        this.commentAuthorId = commentAuthorId;
        this.lineType = lineType;
        this.comment = comment;
    }
}
