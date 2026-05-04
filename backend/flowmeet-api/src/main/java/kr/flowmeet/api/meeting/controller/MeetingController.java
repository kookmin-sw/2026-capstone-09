package kr.flowmeet.api.meeting.controller;

import jakarta.validation.Valid;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.meeting.dto.request.CreateMeetingRequest;
import kr.flowmeet.api.meeting.dto.request.UpdateMeetingRequest;
import kr.flowmeet.api.meeting.facade.MeetingFacade;
import kr.flowmeet.api.meeting.success.MeetingSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/projects/{projectId}")
@RequiredArgsConstructor
public class MeetingController implements MeetingApi {

    private final MeetingFacade meetingFacade;

    @Override
    @PostMapping("/nodes/{nodeId}/meetings")
    public CommonResponse<?> createMeeting(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody CreateMeetingRequest request
    ) {
        meetingFacade.createMeeting(userId, projectId, nodeId, request);
        return CommonResponse.ok(MeetingSuccessCode.CREATE_MEETING);
    }

    @Override
    @PutMapping("/nodes/{nodeId}/meetings/{meetingId}")
    public CommonResponse<?> updateMeeting(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @PathVariable Long meetingId,
            @Valid @RequestBody UpdateMeetingRequest request
    ) {
        meetingFacade.updateMeeting(userId, projectId, meetingId, request);
        return CommonResponse.ok(MeetingSuccessCode.UPDATE_MEETING);
    }

    @Override
    @DeleteMapping("/nodes/{nodeId}/meetings/{meetingId}")
    public CommonResponse<?> deleteMeeting(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @PathVariable Long meetingId
    ) {
        meetingFacade.deleteMeeting(userId, projectId, meetingId);
        return CommonResponse.ok(MeetingSuccessCode.DELETE_MEETING);
    }
}
