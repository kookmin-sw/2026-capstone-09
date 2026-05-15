package kr.flowmeet.external.meeting.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "google.meet")
public record GoogleMeetProperties(
        boolean enabled,
        String applicationName,
        String clientId,
        String clientSecret,
        String calendarId,
        String timezone
) {
}
