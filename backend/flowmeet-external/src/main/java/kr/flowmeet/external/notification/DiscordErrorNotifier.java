package kr.flowmeet.external.notification;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.OffsetDateTime;
import kr.flowmeet.external.notification.config.DiscordProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.MessageEmbed;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;

@Slf4j
@RequiredArgsConstructor
public class DiscordErrorNotifier implements ErrorNotifier {

    private static final int ERROR_COLOR = 0xE74C3C;
    private static final int CODE_BLOCK_OVERHEAD = "```\n\n```".length();
    private static final int CODE_BLOCK_CONTENT_LIMIT = MessageEmbed.VALUE_MAX_LENGTH - CODE_BLOCK_OVERHEAD;
    private static final String TRUNCATION_SUFFIX = "...";
    private static final String ANONYMOUS_USER = "anonymous";

    private final JDA jda;
    private final DiscordProperties properties;

    @Override
    public void notifyError(
            final String title,
            final String description,
            final Long userId,
            final String requestBody,
            final Throwable throwable
    ) {
        try {
            TextChannel channel = jda.getTextChannelById(properties.channelId());
            if (channel == null) {
                log.warn("[DiscordErrorNotifier] channel not found. channelId={}", properties.channelId());
                return;
            }

            MessageEmbed embed = buildEmbed(title, description, userId, requestBody, throwable);
            channel.sendMessageEmbeds(embed).queue(
                    success -> {},
                    failure -> log.error("[DiscordErrorNotifier] send failed", failure)
            );
        } catch (Exception e) {
            log.error("[DiscordErrorNotifier] notifyError failed", e);
        }
    }

    private MessageEmbed buildEmbed(
            final String title,
            final String description,
            final Long userId,
            final String requestBody,
            final Throwable throwable
    ) {
        EmbedBuilder embed = new EmbedBuilder()
                .setTitle(truncate(title, MessageEmbed.TITLE_MAX_LENGTH))
                .setColor(ERROR_COLOR)
                .setTimestamp(OffsetDateTime.now());

        if (description != null && !description.isBlank()) {
            embed.setDescription(truncate(description, MessageEmbed.DESCRIPTION_MAX_LENGTH));
        }

        embed.addField("User ID", userId != null ? String.valueOf(userId) : ANONYMOUS_USER, true);

        if (throwable != null) {
            embed.addField("Exception", truncate(throwable.getClass().getName(), MessageEmbed.VALUE_MAX_LENGTH), true);
        }

        if (requestBody != null && !requestBody.isBlank()) {
            embed.addField("Request Body", asCodeBlock(requestBody), false);
        }

        if (throwable != null) {
            embed.addField("Stack Trace", asCodeBlock(formatStackTrace(throwable)), false);
        }

        return embed.build();
    }

    private String asCodeBlock(final String content) {
        return "```\n" + truncate(content, CODE_BLOCK_CONTENT_LIMIT) + "\n```";
    }

    private String formatStackTrace(final Throwable throwable) {
        StringWriter sw = new StringWriter();
        throwable.printStackTrace(new PrintWriter(sw));
        return sw.toString();
    }

    private String truncate(final String value, final int maxLength) {
        if (value == null) {
            return "";
        }
        if (value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength - TRUNCATION_SUFFIX.length()) + TRUNCATION_SUFFIX;
    }
}
