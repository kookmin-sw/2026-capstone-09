package kr.flowmeet.api.meeting.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회의 종료 응답")
public record EndMeetingResponse(
        @Schema(description = "AI 요약 작업 ID", example = "550e8400-e29b-41d4-a716-446655440000")
        String jobId
) {
    public static EndMeetingResponse from(final String jobId) {
        return new EndMeetingResponse(jobId);
    }
}