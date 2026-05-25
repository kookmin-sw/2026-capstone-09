package kr.flowmeet.external.meeting;

import kr.flowmeet.external.meeting.dto.CreateMeetingRoomCommand;
import kr.flowmeet.external.meeting.dto.MeetingRoom;

public interface MeetingRoomProvider {

    MeetingRoom create(CreateMeetingRoomCommand command);

    void delete(String externalEventId, String hostRefreshToken);
}
