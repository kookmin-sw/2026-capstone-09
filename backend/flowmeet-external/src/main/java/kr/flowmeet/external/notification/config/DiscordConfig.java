package kr.flowmeet.external.notification.config;

import java.util.EnumSet;
import kr.flowmeet.external.notification.DiscordErrorNotifier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.requests.GatewayIntent;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(DiscordProperties.class)
@ConditionalOnProperty(prefix = "discord.error-notifier", name = "enabled", havingValue = "true")
public class DiscordConfig {

    private final DiscordProperties properties;

    @Bean(destroyMethod = "shutdownNow")
    public JDA discordJda() throws InterruptedException {
        log.info("[DiscordConfig] starting JDA");
        JDA jda = JDABuilder.createLight(properties.botToken(), EnumSet.noneOf(GatewayIntent.class))
                .build();
        jda.awaitReady();
        log.info("[DiscordConfig] JDA ready");
        return jda;
    }

    @Bean
    public DiscordErrorNotifier discordErrorNotifier(final JDA discordJda) {
        return new DiscordErrorNotifier(discordJda, properties);
    }
}
