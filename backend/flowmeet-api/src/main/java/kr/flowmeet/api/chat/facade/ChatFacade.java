package kr.flowmeet.api.chat.facade;

import java.util.ArrayList;
import java.util.List;
import kr.flowmeet.api.chat.dto.request.SendMessageRequest;
import kr.flowmeet.api.chat.dto.request.StartChatRequest;
import kr.flowmeet.api.chat.dto.response.AddChatNodeResponse;
import kr.flowmeet.api.chat.dto.response.ChatMessageResponse;
import kr.flowmeet.api.chat.dto.response.ChatSessionSummaryResponse;
import kr.flowmeet.api.chat.dto.response.GetChatSessionResponse;
import kr.flowmeet.api.chat.dto.response.GetReferenceNodesResponse;
import kr.flowmeet.api.chat.dto.response.GetReferenceUsersResponse;
import kr.flowmeet.api.chat.dto.response.SendMessageResponse;
import kr.flowmeet.api.chat.dto.response.StartChatResponse;
import kr.flowmeet.api.chat.dto.response.UpdateChatSessionResponse;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.domain.chat.entity.ChatMessage;
import kr.flowmeet.domain.chat.entity.ChatSession;
import kr.flowmeet.domain.chat.service.ChatMessageService;
import kr.flowmeet.domain.chat.service.ChatSessionNodeService;
import kr.flowmeet.domain.chat.service.ChatSessionService;
import kr.flowmeet.domain.chat.service.ChatSessionUserService;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import kr.flowmeet.external.ai.AiAgentClient;
import kr.flowmeet.external.ai.dto.AiChatResponse;
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
    private final ChatSessionUserService chatSessionUserService;
    private final NodeService nodeService;
    private final ProjectMemberService projectMemberService;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final AiAgentClient aiAgentClient;

    public CursorSliceResponse<ChatSessionSummaryResponse> getAllChatSessions(
            final Long userId,
            final Long projectId,
            final String search,
            final Long cursorId,
            final int size
    ) {
        projectPermissionValidator.validate(projectId, userId);

        List<ChatSession> sessions = chatSessionService.findAllByProjectId(userId, projectId, search, cursorId, size);

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
    public StartChatResponse startChat(
            final Long userId,
            final Long projectId,
            final StartChatRequest request,
            final String authorization
    ) {
        projectPermissionValidator.validate(projectId, userId);

        ChatSession session = chatSessionService.create(projectId, userId, "새 채팅");

        if (request.nodeIds() != null) {
            request.nodeIds().forEach(nodeId -> chatSessionNodeService.add(session.getId(), nodeId));
        }
        if (request.referenceUserIds() != null) {
            request.referenceUserIds().forEach(uid -> chatSessionUserService.register(session.getId(), uid));
        }

        String messageWithHint = buildStartMessageWithHint(request);
        chatMessageService.create(session.getId(), request.content());

        AiChatResponse aiResponse = aiAgentClient.chat(
                messageWithHint, session.getId().toString(), projectId, authorization
        );

        if (aiResponse.sessionName() != null) {
            session.updateTitle(aiResponse.sessionName());
        }

        ChatMessage aiMessage = chatMessageService.createAiResponse(session.getId(), aiResponse.response());
        return StartChatResponse.of(session, aiMessage);
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
        chatSessionUserService.deleteAllByChatSessionId(chatSessionId);
        chatMessageService.softDeleteAllByChatSessionId(chatSessionId);
        chatSessionService.delete(session);
    }

    @Transactional
    public SendMessageResponse sendMessage(
            final Long userId,
            final Long projectId,
            final Long chatSessionId,
            final SendMessageRequest request,
            final String authorization
    ) {
        projectPermissionValidator.validate(projectId, userId);

        ChatSession session = chatSessionService.findByIdAndProjectId(chatSessionId, projectId);
        chatSessionService.validateCreatedBy(session, userId);

        registerReferenceNodes(chatSessionId, request.referenceNodeIds());
        registerReferenceUsers(chatSessionId, request.referenceUserIds());

        String messageWithHint = buildMessageWithHint(request);
        chatMessageService.create(chatSessionId, request.content());

        AiChatResponse aiResponse = aiAgentClient.chat(messageWithHint, chatSessionId.toString(), projectId, authorization);
        ChatMessage aiMessage = chatMessageService.createAiResponse(chatSessionId, aiResponse.response());

        return SendMessageResponse.from(aiMessage);
    }

    private void registerReferenceNodes(final Long chatSessionId, final List<Long> nodeIds) {
        if (nodeIds == null) return;
        nodeIds.forEach(nodeId -> chatSessionNodeService.register(chatSessionId, nodeId));
    }

    private void registerReferenceUsers(final Long chatSessionId, final List<Long> userIds) {
        if (userIds == null) return;
        userIds.forEach(userId -> chatSessionUserService.register(chatSessionId, userId));
    }

    private String buildStartMessageWithHint(final StartChatRequest request) {
        List<String> hints = new ArrayList<>();
        if (request.nodeIds() != null && !request.nodeIds().isEmpty()) {
            hints.add("[참조 노드 ID: " + request.nodeIds() + "]");
        }
        if (request.referenceUserIds() != null && !request.referenceUserIds().isEmpty()) {
            hints.add("[참조 유저 ID: " + request.referenceUserIds() + "]");
        }
        return hints.isEmpty() ? request.content() : String.join(" ", hints) + " " + request.content();
    }

    private String buildMessageWithHint(final SendMessageRequest request) {
        List<String> hints = new ArrayList<>();
        if (request.referenceNodeIds() != null && !request.referenceNodeIds().isEmpty()) {
            hints.add("[참조 노드 ID: " + request.referenceNodeIds() + "]");
        }
        if (request.referenceUserIds() != null && !request.referenceUserIds().isEmpty()) {
            hints.add("[참조 유저 ID: " + request.referenceUserIds() + "]");
        }
        if (hints.isEmpty()) {
            return request.content();
        }
        return String.join(" ", hints) + " " + request.content();
    }

    public GetReferenceNodesResponse getReferenceNodes(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);

        List<Node> nodes = nodeService.findAllByProjectId(projectId);

        return GetReferenceNodesResponse.from(nodes);
    }

    public GetReferenceUsersResponse getReferenceUsers(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);

        List<ProjectMember> members = projectMemberService.findAllByProjectIdOrderByRole(projectId);

        return GetReferenceUsersResponse.from(members);
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