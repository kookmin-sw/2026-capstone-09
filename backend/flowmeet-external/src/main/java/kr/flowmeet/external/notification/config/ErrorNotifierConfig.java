package kr.flowmeet.external.notification.config;

import kr.flowmeet.external.notification.ErrorNotifier;
import kr.flowmeet.external.notification.NoOpErrorNotifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ErrorNotifierConfig {

    @Bean
    @ConditionalOnMissingBean(ErrorNotifier.class)
    public NoOpErrorNotifier noOpErrorNotifier() {
        return new NoOpErrorNotifier();
    }
}
