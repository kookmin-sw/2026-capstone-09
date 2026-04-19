package kr.flowmeet.external.email;

import org.springframework.stereotype.Component;

@Component
public class DefaultEmailSender implements EmailSender {

    @Override
    public void send(String toEmail, String title, String content) {
        System.out.println("Default Email Sender");
    }
}
