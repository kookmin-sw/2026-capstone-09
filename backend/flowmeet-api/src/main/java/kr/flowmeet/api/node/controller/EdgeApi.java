package kr.flowmeet.api.node.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.api.node.dto.request.CreateEdgeRequest;
import kr.flowmeet.api.node.dto.request.UpdateEdgeRequest;
import kr.flowmeet.api.node.success.EdgeSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.node.exception.EdgeErrorCode;
import kr.flowmeet.domain.node.exception.NodeErrorCode;

@Tag(name = "Edge", description = "연결선")
public interface EdgeApi {

    @Operation(summary = "연결선 생성", description = "노드 간 연결선을 추가합니다.")
    @ApiSuccessCode(code = EdgeSuccessCode.class, name = "CREATE_EDGE")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    @ApiErrorCode(code = EdgeErrorCode.class, names = {"EDGE_DUPLICATE"})
    CommonResponse<?> createEdge(
            @UserId Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateEdgeRequest request
    );

    @Operation(summary = "연결선 삭제", description = "연결선을 삭제합니다.")
    @ApiSuccessCode(code = EdgeSuccessCode.class, name = "DELETE_EDGE")
    @ApiErrorCode(code = EdgeErrorCode.class, names = {"EDGE_NOT_FOUND"})
    CommonResponse<?> deleteEdge(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long edgeId
    );
}
