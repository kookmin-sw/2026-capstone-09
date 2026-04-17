package kr.flowmeet.api.node.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.node.dto.request.CreateNodeRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeStatusRequest;
import kr.flowmeet.api.node.dto.response.GetFlowchartResponse;
import kr.flowmeet.api.node.dto.response.GetKanbanResponse;
import kr.flowmeet.api.node.dto.response.GetNodeListResponse;
import kr.flowmeet.api.node.dto.response.GetNodeResponse;
import kr.flowmeet.api.node.dto.response.SearchNodeResponse;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.meeting.exception.MeetingErrorCode;
import kr.flowmeet.domain.node.exception.NodeErrorCode;

@Tag(name = "노드")
public interface NodeApi {

    @Operation(summary = "플로우차트 조회", description = "프로젝트의 전체 노드 트리 + 엣지를 조회합니다.")
    CommonResponse<GetFlowchartResponse> getFlowchart(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "노드 상세 조회", description = "노드 클릭 시 사이드바 상세 정보를 조회합니다.")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    CommonResponse<GetNodeResponse> getNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId
    );

    @Operation(summary = "노드 추가", description = "메인 노드 또는 서브 노드를 추가합니다.")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND", "NODE_CREATE_FORBIDDEN"})
    CommonResponse<?> createNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateNodeRequest request
    );

    @Operation(summary = "노드 수정", description = "노드 제목, 설명, 노트, 상태, 정렬순서를 수정합니다.")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND", "NODE_UPDATE_FORBIDDEN"})
    CommonResponse<?> updateNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeRequest request
    );

    @Operation(summary = "노드 삭제", description = "노드 삭제. 하위 서브 노드도 연쇄 삭제됩니다.")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    @ApiErrorCode(code = MeetingErrorCode.class, names = {"ACTIVE_MEETING_EXISTS"})
    CommonResponse<?> deleteNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId
    );

    @Operation(summary = "리스트 뷰 조회", description = "노드를 리스트 형태로 조회합니다.")
    CommonResponse<GetNodeListResponse> getNodeList(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestParam(required = false) String sort
    );

    @Operation(summary = "칸반 보드 조회", description = "상태별 그룹으로 노드를 조회합니다.")
    CommonResponse<GetKanbanResponse> getKanban(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "칸반 상태 변경", description = "드래그 & 드롭으로 상태와 순서를 변경합니다.")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    CommonResponse<?> updateNodeStatus(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeStatusRequest request
    );

    @Operation(summary = "프로젝트 내 검색", description = "노드 제목, 키워드로 검색합니다.")
    CommonResponse<SearchNodeResponse> search(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestParam String query
    );
}
