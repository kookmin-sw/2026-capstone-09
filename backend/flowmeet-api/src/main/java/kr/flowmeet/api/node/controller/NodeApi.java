package kr.flowmeet.api.node.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.api.node.dto.request.CreateNodeRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeDescriptionRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeKanbanRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeNoteRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeStatusRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeTitleRequest;
import kr.flowmeet.api.node.dto.response.GetFlowchartResponse;
import kr.flowmeet.api.node.dto.response.GetKanbanResponse;
import kr.flowmeet.api.node.dto.response.GetLinkedNodesResponse;
import kr.flowmeet.api.node.dto.response.GetNodeListResponse;
import kr.flowmeet.api.node.dto.response.GetNodeResponse;
import kr.flowmeet.api.node.dto.response.SearchNodeResponse;
import kr.flowmeet.api.node.success.NodeSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.meeting.exception.MeetingErrorCode;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.node.service.NodeSortType;

@Tag(name = "Node", description = "노드")
public interface NodeApi {

    @Operation(summary = "플로우차트 조회", description = "프로젝트의 전체 노드 트리 + 엣지를 조회합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "GET_FLOWCHART")
    CommonResponse<GetFlowchartResponse> getFlowchart(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "노드 상세 조회", description = "노드 클릭 시 사이드바 상세 정보를 조회합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "GET_NODE")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    CommonResponse<GetNodeResponse> getNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId
    );

    @Operation(summary = "노드 추가", description = "메인 노드 또는 서브 노드를 추가합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "CREATE_NODE")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND", "NODE_CREATE_FORBIDDEN"})
    CommonResponse<?> createNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateNodeRequest request
    );

    @Operation(summary = "노드 제목 수정", description = "노드의 제목만 수정합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "UPDATE_NODE_TITLE")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    CommonResponse<?> updateNodeTitle(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeTitleRequest request
    );

    @Operation(summary = "노드 설명 수정", description = "노드의 설명만 수정합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "UPDATE_NODE_DESCRIPTION")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    CommonResponse<?> updateNodeDescription(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeDescriptionRequest request
    );

    @Operation(summary = "노드 노트 수정", description = "노드의 노트(마크다운)만 수정합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "UPDATE_NODE_NOTE")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    CommonResponse<?> updateNodeNote(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeNoteRequest request
    );

    @Operation(summary = "노드 삭제", description = "노드 삭제. 하위 서브 노드도 연쇄 삭제됩니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "DELETE_NODE")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    @ApiErrorCode(code = MeetingErrorCode.class, names = {"ACTIVE_MEETING_EXISTS"})
    CommonResponse<?> deleteNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId
    );

    @Operation(summary = "리스트 뷰 조회", description = "노드를 리스트 형태로 조회합니다. (LATEST: 최신순, NAME: 가나다순)")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "GET_NODE_LIST")
    CommonResponse<GetNodeListResponse> getNodeList(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "LATEST") NodeSortType sort
    );

    @Operation(summary = "칸반 보드 조회", description = "상태별 그룹으로 노드를 조회합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "GET_KANBAN")
    CommonResponse<GetKanbanResponse> getKanban(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "칸반 카드 이동", description = "드래그 & 드롭으로 상태와 순서를 동시에 변경합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "UPDATE_NODE_KANBAN")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    CommonResponse<?> updateNodeKanban(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeKanbanRequest request
    );

    @Operation(summary = "노드 상태 변경", description = "노드의 상태(WAITING/IN_PROGRESS/DONE)만 변경합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "UPDATE_NODE_STATUS")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    CommonResponse<?> updateNodeStatus(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeStatusRequest request
    );

    @Operation(summary = "연결된 노드 조회", description = "노드와 연결선으로 이어진 상대 노드 목록을 조회합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "GET_LINKED_NODES")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    CommonResponse<GetLinkedNodesResponse> getLinkedNodes(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId
    );

    @Operation(summary = "프로젝트 내 검색", description = "노드 제목, 키워드로 검색합니다.")
    @ApiSuccessCode(code = NodeSuccessCode.class, name = "SEARCH")
    CommonResponse<SearchNodeResponse> search(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestParam String query
    );
}
