package kr.flowmeet.api.meeting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.api.meeting.dto.request.CreateMeetingRequest;
import kr.flowmeet.api.meeting.dto.request.UpdateMeetingRequest;
import kr.flowmeet.api.meeting.success.MeetingSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.meeting.exception.MeetingErrorCode;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Meeting", description = "회의")
public interface MeetingApi {

    @Operation(summary = "회의 생성", description = "노드에 회의를 생성합니다. 화상 회의 링크를 함께 발급합니다.")
    @ApiSuccessCode(code = MeetingSuccessCode.class, name = "CREATE_MEETING")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND"})
    @ApiErrorCode(code = MeetingErrorCode.class, names = {
            "MEETING_ALREADY_EXISTS",
            "MEETING_INVALID_TIME"
    })
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_NOT_FOUND", "PROJECT_ACCESS_DENIED"})
    CommonResponse<?> createMeeting(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody CreateMeetingRequest request
    );

    @Operation(summary = "회의 수정", description = "회의 시작 시간과 참여자를 수정합니다.")
    @ApiSuccessCode(code = MeetingSuccessCode.class, name = "UPDATE_MEETING")
    @ApiErrorCode(code = MeetingErrorCode.class, names = {
            "MEETING_NOT_FOUND",
            "MEETING_NOT_SCHEDULED",
            "MEETING_UPDATE_FORBIDDEN",
            "MEETING_INVALID_TIME"
    })
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_NOT_FOUND", "PROJECT_ACCESS_DENIED"})
    CommonResponse<?> updateMeeting(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @PathVariable Long meetingId,
            @Valid @RequestBody UpdateMeetingRequest request
    );

    @Operation(summary = "회의 삭제", description = "회의를 삭제합니다. 발급된 화상 회의 링크도 함께 정리합니다.")
    @ApiSuccessCode(code = MeetingSuccessCode.class, name = "DELETE_MEETING")
    @ApiErrorCode(code = MeetingErrorCode.class, names = {
            "MEETING_NOT_FOUND",
            "MEETING_DELETE_FORBIDDEN",
            "MEETING_IN_PROGRESS"
    })
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED"})
    CommonResponse<?> deleteMeeting(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @PathVariable Long meetingId
    );
}
