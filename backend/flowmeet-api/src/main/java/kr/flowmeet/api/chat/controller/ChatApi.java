package kr.flowmeet.api.chat.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.flowmeet.api.chat.dto.request.AddChatNodeRequest;
import kr.flowmeet.api.chat.dto.request.SendMessageRequest;
import kr.flowmeet.api.chat.dto.request.StartChatRequest;
import kr.flowmeet.api.chat.dto.request.UpdateChatSessionRequest;
import kr.flowmeet.api.chat.dto.response.AddChatNodeResponse;
import kr.flowmeet.api.chat.dto.response.ChatSessionSummaryResponse;
import kr.flowmeet.api.chat.dto.response.GetChatSessionResponse;
import kr.flowmeet.api.chat.dto.response.GetReferenceNodesResponse;
import kr.flowmeet.api.chat.dto.response.GetReferenceUsersResponse;
import kr.flowmeet.api.chat.dto.response.SendMessageResponse;
import kr.flowmeet.api.chat.dto.response.StartChatResponse;
import kr.flowmeet.api.chat.dto.response.UpdateChatSessionResponse;
import kr.flowmeet.api.chat.success.ChatSuccessCode;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.chat.exception.ChatErrorCode;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.external.ai.AiAgentErrorCode;

@Tag(name = "Chat", description = "채팅")
public interface ChatApi {

    @Operation(summary = "채팅 세션 목록 조회")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "GET_ALL_CHAT_SESSIONS")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED"})
    CommonResponse<CursorSliceResponse<ChatSessionSummaryResponse>> getAllChatSessions(
            @UserId Long userId,
            Long projectId,
            String search,
            Long cursorId,
            int size);

    @Operation(summary = "채팅 상세 조회 (메시지 내역)")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "GET_CHAT_SESSION")
    @ApiErrorCode(code = ChatErrorCode.class, names = {"CHAT_SESSION_NOT_FOUND"})
    CommonResponse<GetChatSessionResponse> getChatSessionDetail(
            @UserId Long userId,
            Long projectId,
            Long chatSessionId,
            Long cursorId,
            int size);

    @Operation(summary = "새 채팅 시작 (세션 생성 + 첫 메시지 전송)")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "START_CHAT")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED"})
    @ApiErrorCode(code = AiAgentErrorCode.class, names = {"AI_AGENT_UNAVAILABLE"})
    CommonResponse<StartChatResponse> startChat(
            @UserId Long userId,
            Long projectId,
            StartChatRequest request,
            String authorization);

    @Operation(summary = "채팅 제목 수정")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "UPDATE_CHAT_SESSION")
    @ApiErrorCode(code = ChatErrorCode.class, names = {"CHAT_SESSION_NOT_FOUND"})
    CommonResponse<UpdateChatSessionResponse> updateChatSession(
            @UserId Long userId,
            Long projectId,
            Long chatSessionId,
            UpdateChatSessionRequest request);

    @Operation(summary = "채팅 삭제")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "DELETE_CHAT_SESSION")
    @ApiErrorCode(code = ChatErrorCode.class, names = {"CHAT_SESSION_NOT_FOUND"})
    CommonResponse<?> deleteChatSession(
            @UserId Long userId,
            Long projectId,
            Long chatSessionId);

    @Operation(summary = "메시지 전송")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "SEND_MESSAGE")
    @ApiErrorCode(code = ChatErrorCode.class, names = {"CHAT_SESSION_NOT_FOUND"})
    @ApiErrorCode(code = AiAgentErrorCode.class, names = {"AI_AGENT_UNAVAILABLE"})
    CommonResponse<SendMessageResponse> sendMessage(
            @UserId Long userId,
            Long projectId,
            Long chatSessionId,
            SendMessageRequest request,
            String authorization);

    @Operation(summary = "참조 가능한 노드 조회")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "GET_REFERENCE_NODES")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED"})
    CommonResponse<GetReferenceNodesResponse> getReferenceNodes(
            @UserId Long userId,
            Long projectId);

    @Operation(summary = "참조 가능한 사용자 조회")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "GET_REFERENCE_USERS")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED"})
    CommonResponse<GetReferenceUsersResponse> getReferenceUsers(
            @UserId Long userId,
            Long projectId);

    @Operation(summary = "참조 노드 추가")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "ADD_CHAT_NODE")
    @ApiErrorCode(code = ChatErrorCode.class, names = {"CHAT_SESSION_NOT_FOUND", "CHAT_NODE_ALREADY_EXISTS"})
    CommonResponse<AddChatNodeResponse> addChatNode(
            @UserId Long userId,
            Long projectId,
            Long chatSessionId,
            AddChatNodeRequest request);

    @Operation(summary = "참조 노드 제거")
    @ApiSuccessCode(code = ChatSuccessCode.class, name = "REMOVE_CHAT_NODE")
    @ApiErrorCode(code = ChatErrorCode.class, names = {"CHAT_SESSION_NOT_FOUND", "CHAT_NODE_NOT_FOUND"})
    CommonResponse<?> removeChatNode(
            @UserId Long userId,
            Long projectId,
            Long chatSessionId,
            Long nodeId);
}