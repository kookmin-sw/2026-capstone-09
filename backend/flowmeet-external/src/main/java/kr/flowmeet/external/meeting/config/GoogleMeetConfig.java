package kr.flowmeet.external.meeting.config;

import kr.flowmeet.external.meeting.GoogleMeetRoomProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(GoogleMeetProperties.class)
@ConditionalOnProperty(prefix = "google.meet", name = "enabled", havingValue = "true")
public class GoogleMeetConfig {

    private final GoogleMeetProperties properties;

    @Bean
    public GoogleMeetRoomProvider googleMeetRoomProvider() {
        log.info("[GoogleMeetConfig] google meet provider enabled. application={}", properties.applicationName());
        return new GoogleMeetRoomProvider(properties);
    }
}
