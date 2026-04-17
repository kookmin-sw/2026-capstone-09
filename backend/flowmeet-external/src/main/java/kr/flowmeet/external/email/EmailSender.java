package kr.flowmeet.external.email;

import org.springframework.stereotype.Component;

@Component
public interface EmailSender {

    void send(String toEmail, String title, String content);
}
