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
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "node_tags",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_node_tags_node_id_tag_id", columnNames = { "node_id", "tag_id" })
        },
        indexes = {
                @Index(name = "idx_node_tags_tag_id", columnList = "tag_id"),
                @Index(name = "idx_node_tags_node_id", columnList = "node_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NodeTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "node_tag_id")
    private Long id;

    @Column(name = "tag_id", nullable = false)
    private Long tagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", insertable = false, updatable = false)
    private Tag tag;

    @Column(name = "node_id", nullable = false)
    private Long nodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "node_id", insertable = false, updatable = false)
    private Node node;

    @Builder
    public NodeTag(Long tagId, Long nodeId) {
        this.tagId = tagId;
        this.nodeId = nodeId;
    }
}
