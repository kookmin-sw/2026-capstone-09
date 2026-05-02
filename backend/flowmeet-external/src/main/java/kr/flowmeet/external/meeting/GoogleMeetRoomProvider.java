package kr.flowmeet.external.meeting;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.ConferenceData;
import com.google.api.services.calendar.model.ConferenceSolutionKey;
import com.google.api.services.calendar.model.CreateConferenceRequest;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.UUID;
import kr.flowmeet.external.exception.ExternalException;
import kr.flowmeet.external.meeting.config.GoogleMeetProperties;
import kr.flowmeet.external.meeting.dto.CreateMeetingRoomCommand;
import kr.flowmeet.external.meeting.dto.MeetingRoom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnBean(Calendar.class)
public class GoogleMeetRoomProvider implements MeetingRoomProvider {

    private static final String CONFERENCE_SOLUTION_TYPE = "hangoutsMeet";
    private static final int CONFERENCE_DATA_VERSION = 1;
    private static final String SEND_UPDATES = "none";

    private final Calendar calendar;
    private final GoogleMeetProperties properties;

    @Override
    public MeetingRoom create(final CreateMeetingRoomCommand command) {
        try {
            Event event = buildEvent(command);
            Event created = calendar.events()
                    .insert(properties.calendarId(), event)
                    .setConferenceDataVersion(CONFERENCE_DATA_VERSION)
                    .setSendUpdates(SEND_UPDATES)
                    .execute();

            String hangoutLink = created.getHangoutLink();
            if (hangoutLink == null || hangoutLink.isBlank()) {
                log.error("[GoogleMeetRoomProvider] hangoutLink is empty. eventId={}", created.getId());
                throw new ExternalException(MeetingExternalErrorCode.MEETING_PROVIDER_CREATE_FAILED);
            }
            return MeetingRoom.of(hangoutLink, created.getId());
        } catch (IOException e) {
            log.error("[GoogleMeetRoomProvider] create failed", e);
            throw new ExternalException(MeetingExternalErrorCode.MEETING_PROVIDER_CREATE_FAILED);
        }
    }

    @Override
    public void delete(final String externalEventId) {
        if (externalEventId == null || externalEventId.isBlank()) {
            return;
        }
        try {
            calendar.events()
                    .delete(properties.calendarId(), externalEventId)
                    .setSendUpdates(SEND_UPDATES)
                    .execute();
        } catch (GoogleJsonResponseException e) {
            if (e.getStatusCode() == 404 || e.getStatusCode() == 410) {
                log.warn("[GoogleMeetRoomProvider] event already missing. eventId={}", externalEventId);
                return;
            }
            log.error("[GoogleMeetRoomProvider] delete failed. eventId={}", externalEventId, e);
            throw new ExternalException(MeetingExternalErrorCode.MEETING_PROVIDER_DELETE_FAILED);
        } catch (IOException e) {
            log.error("[GoogleMeetRoomProvider] delete failed. eventId={}", externalEventId, e);
            throw new ExternalException(MeetingExternalErrorCode.MEETING_PROVIDER_DELETE_FAILED);
        }
    }

    private Event buildEvent(final CreateMeetingRoomCommand command) {
        ConferenceSolutionKey solutionKey = new ConferenceSolutionKey().setType(CONFERENCE_SOLUTION_TYPE);
        CreateConferenceRequest createRequest = new CreateConferenceRequest()
                .setRequestId(UUID.randomUUID().toString())
                .setConferenceSolutionKey(solutionKey);
        ConferenceData conferenceData = new ConferenceData().setCreateRequest(createRequest);

        return new Event()
                .setSummary(command.title())
                .setStart(toEventDateTime(command.startedAt()))
                .setEnd(toEventDateTime(command.endedAt()))
                .setConferenceData(conferenceData);
    }

    private EventDateTime toEventDateTime(final LocalDateTime localDateTime) {
        ZoneId zoneId = ZoneId.of(properties.timezone());
        ZonedDateTime zonedDateTime = localDateTime.atZone(zoneId);
        DateTime dateTime = new DateTime(zonedDateTime.toInstant().toEpochMilli());
        return new EventDateTime()
                .setDateTime(dateTime)
                .setTimeZone(zoneId.getId());
    }
}
