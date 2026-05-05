package kr.flowmeet.api.chat.facade;

import java.util.List;
import kr.flowmeet.api.chat.dto.request.CreateChatSessionRequest;
import kr.flowmeet.api.chat.dto.response.AddChatNodeResponse;
import kr.flowmeet.api.chat.dto.response.ChatMessageResponse;
import kr.flowmeet.api.chat.dto.response.ChatSessionSummaryResponse;
import kr.flowmeet.api.chat.dto.response.CreateChatSessionResponse;
import kr.flowmeet.api.chat.dto.response.GetChatSessionResponse;
import kr.flowmeet.api.chat.dto.response.GetReferenceNodesResponse;
import kr.flowmeet.api.chat.dto.response.SendMessageResponse;
import kr.flowmeet.api.chat.dto.response.UpdateChatSessionResponse;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.domain.chat.entity.ChatMessage;
import kr.flowmeet.domain.chat.entity.ChatSession;
import kr.flowmeet.domain.chat.service.ChatMessageService;
import kr.flowmeet.domain.chat.service.ChatSessionNodeService;
import kr.flowmeet.domain.chat.service.ChatSessionService;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatFacade {

    private final ChatSessionService chatSessionService;
    private final ChatMessageService chatMessageService;
    private final ChatSessionNodeService chatSessionNodeService;
    private final NodeService nodeService;
    private final ProjectPermissionValidator projectPermissionValidator;

    public CursorSliceResponse<ChatSessionSummaryResponse> getAllChatSessions(
            final Long userId,
            final Long projectId,
            final String search,
            final Long cursorId,
            final int size
    ) {
        projectPermissionValidator.validate(projectId, userId);

        List<ChatSession> sessions = chatSessionService.findAllByProjectId(projectId, search, cursorId, size);

        return CursorSliceResponse.of(
                sessions,
                size,
                ChatSessionSummaryResponse::from,
                ChatSession::getId
        );
    }

    public GetChatSessionResponse getChatSessionDetail(
            final Long userId,
            final Long projectId,
            final Long chatSessionId,
            final Long cursorId,
            final int size
    ) {
        projectPermissionValidator.validate(projectId, userId);

        ChatSession session = chatSessionService.findByIdAndProjectId(chatSessionId, projectId);
        chatSessionService.validateCreatedBy(session, userId);
        List<Node> nodes = chatSessionNodeService.findAllNodesByChatSessionId(chatSessionId);
        List<ChatMessage> messages = chatMessageService.findAllByChatSessionId(chatSessionId, cursorId, size);

        boolean hasNext = messages.size() > size;
        List<ChatMessage> content = hasNext ? messages.subList(0, size) : messages;

        List<ChatMessageResponse> messageResponses = content.stream()
                .map(ChatMessageResponse::from)
                .toList();

        return GetChatSessionResponse.of(session, nodes, messageResponses, hasNext);
    }

    @Transactional
    public CreateChatSessionResponse createChatSession(
            final Long userId,
            final Long projectId,
            final CreateChatSessionRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId);

        ChatSession session = chatSessionService.create(projectId, userId, request.title());

        List<Node> nodes = List.of();
        if (request.nodeIds() != null && !request.nodeIds().isEmpty()) {
            nodes = nodeService.findAllByIdsAndProjectId(request.nodeIds(), projectId);
            for (Long nodeId : request.nodeIds()) {
                chatSessionNodeService.add(session.getId(), nodeId);
            }
        }

        return CreateChatSessionResponse.of(session, nodes);
    }

    @Transactional
    public UpdateChatSessionResponse updateChatSession(
            final Long userId,
            final Long projectId,
            final Long chatSessionId,
            final String title
    ) {
        projectPermissionValidator.validate(projectId, userId);

        ChatSession session = chatSessionService.findByIdAndProjectId(chatSessionId, projectId);
        chatSessionService.validateCreatedBy(session, userId);
        session.updateTitle(title);

        return UpdateChatSessionResponse.from(session);
    }

    @Transactional
    public void deleteChatSession(final Long userId, final Long projectId, final Long chatSessionId) {
        projectPermissionValidator.validate(projectId, userId);

        ChatSession session = chatSessionService.findByIdAndProjectId(chatSessionId, projectId);
        chatSessionService.validateCreatedBy(session, userId);
        chatSessionNodeService.deleteAllByChatSessionId(chatSessionId);
        chatMessageService.softDeleteAllByChatSessionId(chatSessionId);
        chatSessionService.delete(session);
    }

    @Transactional
    public SendMessageResponse sendMessage(
            final Long userId,
            final Long projectId,
            final Long chatSessionId,
            final String content
    ) {
        projectPermissionValidator.validate(projectId, userId);

        ChatSession session = chatSessionService.findByIdAndProjectId(chatSessionId, projectId);
        chatSessionService.validateCreatedBy(session, userId);

        ChatMessage message = chatMessageService.create(chatSessionId, content);

        return SendMessageResponse.from(message);
    }

    public GetReferenceNodesResponse getReferenceNodes(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);

        List<Node> nodes = nodeService.findAllByProjectId(projectId);

        return GetReferenceNodesResponse.from(nodes);
    }

    @Transactional
    public AddChatNodeResponse addChatNode(
            final Long userId,
            final Long projectId,
            final Long chatSessionId,
            final Long nodeId
    ) {
        projectPermissionValidator.validate(projectId, userId);

        ChatSession session = chatSessionService.findByIdAndProjectId(chatSessionId, projectId);
        chatSessionService.validateCreatedBy(session, userId);

        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);
        chatSessionNodeService.add(chatSessionId, nodeId);

        return AddChatNodeResponse.of(chatSessionId, node);
    }

    @Transactional
    public void removeChatNode(
            final Long userId,
            final Long projectId,
            final Long chatSessionId,
            final Long nodeId
    ) {
        projectPermissionValidator.validate(projectId, userId);

        ChatSession session = chatSessionService.findByIdAndProjectId(chatSessionId, projectId);
        chatSessionService.validateCreatedBy(session, userId);

        chatSessionNodeService.remove(chatSessionId, nodeId);
    }
}