package kr.flowmeet.api.chat.controller;

import jakarta.validation.Valid;
import kr.flowmeet.api.chat.dto.request.AddChatNodeRequest;
import kr.flowmeet.api.chat.dto.request.CreateChatSessionRequest;
import kr.flowmeet.api.chat.dto.request.SendMessageRequest;
import kr.flowmeet.api.chat.dto.request.UpdateChatSessionRequest;
import kr.flowmeet.api.chat.dto.response.AddChatNodeResponse;
import kr.flowmeet.api.chat.dto.response.ChatSessionSummaryResponse;
import kr.flowmeet.api.chat.dto.response.CreateChatSessionResponse;
import kr.flowmeet.api.chat.dto.response.GetChatSessionResponse;
import kr.flowmeet.api.chat.dto.response.GetReferenceNodesResponse;
import kr.flowmeet.api.chat.dto.response.SendMessageResponse;
import kr.flowmeet.api.chat.dto.response.UpdateChatSessionResponse;
import kr.flowmeet.api.chat.facade.ChatFacade;
import kr.flowmeet.api.chat.success.ChatSuccessCode;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.auth.annotation.UserId;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/projects/{projectId}/chats")
@RequiredArgsConstructor
public class ChatController implements ChatApi {

    private final ChatFacade chatFacade;

    @Override
    @GetMapping
    public CommonResponse<CursorSliceResponse<ChatSessionSummaryResponse>> getAllChatSessions(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "20") int size
    ) {
        return CommonResponse.ok(
                ChatSuccessCode.GET_ALL_CHAT_SESSIONS,
                chatFacade.getAllChatSessions(userId, projectId, search, cursorId, size)
        );
    }

    @Override
    @GetMapping("/{chatSessionId}")
    public CommonResponse<GetChatSessionResponse> getChatSessionDetail(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long chatSessionId,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "30") int size
    ) {
        return CommonResponse.ok(
                ChatSuccessCode.GET_CHAT_SESSION,
                chatFacade.getChatSessionDetail(userId, projectId, chatSessionId, cursorId, size)
        );
    }

    @Override
    @PostMapping
    public CommonResponse<CreateChatSessionResponse> createChatSession(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestBody @Valid CreateChatSessionRequest request
    ) {
        return CommonResponse.ok(
                ChatSuccessCode.CREATE_CHAT_SESSION,
                chatFacade.createChatSession(userId, projectId, request)
        );
    }

    @Override
    @PatchMapping("/{chatSessionId}")
    public CommonResponse<UpdateChatSessionResponse> updateChatSession(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long chatSessionId,
            @RequestBody @Valid UpdateChatSessionRequest request
    ) {
        return CommonResponse.ok(
                ChatSuccessCode.UPDATE_CHAT_SESSION,
                chatFacade.updateChatSession(userId, projectId, chatSessionId, request.title())
        );
    }

    @Override
    @DeleteMapping("/{chatSessionId}")
    public CommonResponse<?> deleteChatSession(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long chatSessionId
    ) {
        chatFacade.deleteChatSession(userId, projectId, chatSessionId);
        return CommonResponse.ok(ChatSuccessCode.DELETE_CHAT_SESSION);
    }

    @Override
    @PostMapping("/{chatSessionId}/messages")
    public CommonResponse<SendMessageResponse> sendMessage(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long chatSessionId,
            @RequestBody @Valid SendMessageRequest request
    ) {
        return CommonResponse.ok(
                ChatSuccessCode.SEND_MESSAGE,
                chatFacade.sendMessage(userId, projectId, chatSessionId, request.content())
        );
    }

    @Override
    @GetMapping("/nodes")
    public CommonResponse<GetReferenceNodesResponse> getReferenceNodes(
            @UserId Long userId,
            @PathVariable Long projectId
    ) {
        return CommonResponse.ok(
                ChatSuccessCode.GET_REFERENCE_NODES,
                chatFacade.getReferenceNodes(userId, projectId)
        );
    }

    @Override
    @PostMapping("/{chatSessionId}/nodes")
    public CommonResponse<AddChatNodeResponse> addChatNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long chatSessionId,
            @RequestBody @Valid AddChatNodeRequest request
    ) {
        return CommonResponse.ok(
                ChatSuccessCode.ADD_CHAT_NODE,
                chatFacade.addChatNode(userId, projectId, chatSessionId, request.nodeId())
        );
    }

    @Override
    @DeleteMapping("/{chatSessionId}/nodes/{nodeId}")
    public CommonResponse<?> removeChatNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long chatSessionId,
            @PathVariable Long nodeId
    ) {
        chatFacade.removeChatNode(userId, projectId, chatSessionId, nodeId);
        return CommonResponse.ok(ChatSuccessCode.REMOVE_CHAT_NODE);
    }
}