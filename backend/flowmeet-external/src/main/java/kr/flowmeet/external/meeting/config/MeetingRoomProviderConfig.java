package kr.flowmeet.external.meeting.config;

import kr.flowmeet.external.meeting.LocalMeetingRoomProvider;
import kr.flowmeet.external.meeting.MeetingRoomProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MeetingRoomProviderConfig {

    @Bean
    @ConditionalOnMissingBean(MeetingRoomProvider.class)
    public LocalMeetingRoomProvider localMeetingRoomProvider() {
        return new LocalMeetingRoomProvider();
    }
}
