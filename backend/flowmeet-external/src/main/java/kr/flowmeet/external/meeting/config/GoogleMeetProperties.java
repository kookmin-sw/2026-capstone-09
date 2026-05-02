package kr.flowmeet.external.meeting.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "google.meet")
public record GoogleMeetProperties(
        String applicationName,
        String serviceAccountKeyPath,
        String impersonationUser,
        String calendarId,
        String timezone
) {
}
