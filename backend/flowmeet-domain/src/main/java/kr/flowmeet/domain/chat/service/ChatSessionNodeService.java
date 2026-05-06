package kr.flowmeet.domain.chat.service;

import java.util.List;
import kr.flowmeet.domain.chat.entity.ChatSessionNode;
import kr.flowmeet.domain.chat.exception.ChatErrorCode;
import kr.flowmeet.domain.chat.repository.ChatSessionNodeRepository;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.node.entity.Node;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatSessionNodeService {

    private final ChatSessionNodeRepository chatSessionNodeRepository;

    public List<ChatSessionNode> findAllByChatSessionId(final Long chatSessionId) {
        return chatSessionNodeRepository.findAllByChatSessionId(chatSessionId);
    }

    public List<Node> findAllNodesByChatSessionId(final Long chatSessionId) {
        return chatSessionNodeRepository.findAllWithNodeByChatSessionId(chatSessionId)
                .stream()
                .map(ChatSessionNode::getNode)
                .toList();
    }

    @Transactional
    public ChatSessionNode add(final Long chatSessionId, final Long nodeId) {
        if (chatSessionNodeRepository.existsByChatSessionIdAndNodeId(chatSessionId, nodeId)) {
            throw new BusinessException(ChatErrorCode.CHAT_NODE_ALREADY_EXISTS);
        }

        return chatSessionNodeRepository.save(
                ChatSessionNode.builder()
                        .chatSessionId(chatSessionId)
                        .nodeId(nodeId)
                        .build()
        );
    }

    @Transactional
    public void remove(final Long chatSessionId, final Long nodeId) {
        ChatSessionNode chatSessionNode = chatSessionNodeRepository
                .findByChatSessionIdAndNodeId(chatSessionId, nodeId)
                .orElseThrow(() -> new BusinessException(ChatErrorCode.CHAT_NODE_NOT_FOUND));

        chatSessionNodeRepository.delete(chatSessionNode);
    }

    @Transactional
    public void deleteAllByChatSessionId(final Long chatSessionId) {
        chatSessionNodeRepository.deleteAllByChatSessionId(chatSessionId);
    }
}