package kr.flowmeet.external.email;

import java.util.Map;

public interface EmailSender {

    void send(String toEmail, String title, String templateName, Map<String, Object> variables);
}
