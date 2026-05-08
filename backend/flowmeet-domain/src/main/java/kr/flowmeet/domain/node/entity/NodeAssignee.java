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
import jakarta.persistence.UniqueConstraint;
import kr.flowmeet.domain.common.BaseTimeEntity;
import kr.flowmeet.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "node_assignees",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_node_assignees_node_id_user_id", columnNames = { "node_id", "user_id" })
        },
        indexes = {
                @Index(name = "idx_node_assignees_node_id", columnList = "node_id"),
                @Index(name = "idx_node_assignees_user_id", columnList = "user_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NodeAssignee extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "node_assignee_id")
    private Long id;

    @Column(name = "node_id", nullable = false)
    private Long nodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "node_id", insertable = false, updatable = false)
    private Node node;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Builder
    public NodeAssignee(Long nodeId, Long userId) {
        this.nodeId = nodeId;
        this.userId = userId;
    }
}
