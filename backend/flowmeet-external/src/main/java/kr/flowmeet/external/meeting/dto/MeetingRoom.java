package kr.flowmeet.external.meeting.dto;

public record MeetingRoom(String url, String externalEventId) {

    public static MeetingRoom of(final String url, final String externalEventId) {
        return new MeetingRoom(url, externalEventId);
    }
}
