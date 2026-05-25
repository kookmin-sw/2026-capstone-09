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
import jakarta.persistence.UniqueConstraint;
import kr.flowmeet.domain.common.BaseCreatedTimeEntity;
import kr.flowmeet.domain.node.entity.Node;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "chat_session_nodes",
        indexes = {
                @Index(name = "idx_chat_session_nodes_chat_session_id", columnList = "chat_session_id"),
                @Index(name = "idx_chat_session_nodes_node_id", columnList = "node_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_chat_session_nodes", columnNames = {"chat_session_id", "node_id"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatSessionNode extends BaseCreatedTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_session_node_id")
    private Long id;

    @Column(name = "chat_session_id", nullable = false)
    private Long chatSessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_session_id", insertable = false, updatable = false)
    private ChatSession chatSession;

    @Column(name = "node_id", nullable = false)
    private Long nodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "node_id", insertable = false, updatable = false)
    private Node node;

    @Builder
    public ChatSessionNode(Long chatSessionId, Long nodeId) {
        this.chatSessionId = chatSessionId;
        this.nodeId = nodeId;
    }
}