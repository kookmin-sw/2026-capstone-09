package kr.flowmeet.api.meeting.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.api.common.validation.ValidationMessage;
import kr.flowmeet.domain.meeting.service.vo.CreateMeetingCommand;

@Schema(description = "회의 생성 요청")
public record CreateMeetingRequest(
        @Schema(description = "회의 시작 시각 (날짜+시간)", example = "2026-05-20T15:30:00")
        @NotNull(message = ValidationMessage.MEETING_STARTED_AT_REQUIRED)
        LocalDateTime startedAt,
        @Schema(description = "참여자 사용자 ID 목록", example = "[10, 20, 30]")
        @NotEmpty(message = ValidationMessage.MEETING_PARTICIPANTS_REQUIRED)
        List<Long> participantUserIds,
        @Schema(description = "알림 발송 여부")
        boolean isPushEnabled
) {
    public CreateMeetingCommand toCommand() {
        return new CreateMeetingCommand(startedAt, participantUserIds, isPushEnabled);
    }
}
