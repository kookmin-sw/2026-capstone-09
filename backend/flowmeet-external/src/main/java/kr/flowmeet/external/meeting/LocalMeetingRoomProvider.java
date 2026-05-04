package kr.flowmeet.external.meeting;

import java.security.SecureRandom;
import java.util.UUID;
import kr.flowmeet.external.meeting.dto.CreateMeetingRoomCommand;
import kr.flowmeet.external.meeting.dto.MeetingRoom;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LocalMeetingRoomProvider implements MeetingRoomProvider {

    private static final String MEET_URL_PREFIX = "https://meet.google.com/";
    private static final String CODE_CHARS = "abcdefghijklmnopqrstuvwxyz";
    private static final int SEGMENT_LENGTH = 3;

    private final SecureRandom random = new SecureRandom();

    @Override
    public MeetingRoom create(final CreateMeetingRoomCommand command) {
        String code = generateCode() + "-" + generateCode() + "-" + generateCode();
        String externalEventId = "local-" + UUID.randomUUID();
        log.info("[LocalMeetingRoomProvider] issued stub meeting url. title={}, startedAt={}",
                command.title(), command.startedAt());
        return MeetingRoom.of(MEET_URL_PREFIX + code, externalEventId);
    }

    @Override
    public void delete(final String externalEventId, final String hostRefreshToken) {
        log.info("[LocalMeetingRoomProvider] delete stub meeting. externalEventId={}", externalEventId);
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder(SEGMENT_LENGTH);
        for (int i = 0; i < SEGMENT_LENGTH; i++) {
            sb.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
        }
        return sb.toString();
    }
}
