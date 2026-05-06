package kr.flowmeet.external.notification.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "discord.error-notifier")
public record DiscordProperties(
        boolean enabled,
        String botToken,
        String channelId
) {
}
