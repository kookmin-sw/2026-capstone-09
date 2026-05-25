package kr.flowmeet.external.email;

import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Slf4j
@Component
@RequiredArgsConstructor
public class DefaultEmailSender implements EmailSender {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username:}")
    private String from;

    @Override
    public void send(final String toEmail, final String title, final String templateName, final Map<String, Object> variables) {
        try {
            Context context = new Context();
            context.setVariables(variables);
            String html = templateEngine.process(templateName, context);

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, StandardCharsets.UTF_8.name());
            helper.setTo(toEmail);
            helper.setSubject(title);
            helper.setText(html, true);
            if (from != null && !from.isBlank()) {
                helper.setFrom(from);
            }
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("[DefaultEmailSender] send failed. to={}, title={}, template={}", toEmail, title, templateName, e);
            throw new RuntimeException(e);
        }
    }
}
