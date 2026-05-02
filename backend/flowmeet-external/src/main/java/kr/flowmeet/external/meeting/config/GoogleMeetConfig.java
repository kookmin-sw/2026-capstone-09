package kr.flowmeet.external.meeting.config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import java.io.FileInputStream;
import java.util.List;
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
@ConditionalOnProperty(prefix = "google.meet", name = "service-account-key-path")
public class GoogleMeetConfig {

    private final GoogleMeetProperties properties;

    @Bean
    public Calendar googleCalendarClient() throws Exception {
        try (FileInputStream keyStream = new FileInputStream(properties.serviceAccountKeyPath())) {
            GoogleCredentials credentials = ServiceAccountCredentials
                    .fromStream(keyStream)
                    .createScoped(List.of(CalendarScopes.CALENDAR));

            if (properties.impersonationUser() != null && !properties.impersonationUser().isBlank()) {
                credentials = credentials.createDelegated(properties.impersonationUser());
            }

            NetHttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();
            return new Calendar.Builder(
                    transport,
                    GsonFactory.getDefaultInstance(),
                    new HttpCredentialsAdapter(credentials)
            )
                    .setApplicationName(properties.applicationName())
                    .build();
        }
    }
}
