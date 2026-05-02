package kr.flowmeet.api.meeting.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MeetingSuccessCode implements SuccessCode {
    CREATE_MEETING("회의를 만들었어요."),
    UPDATE_MEETING("회의 정보를 수정했어요."),
    DELETE_MEETING("회의를 삭제했어요.");

    private final String message;
}
