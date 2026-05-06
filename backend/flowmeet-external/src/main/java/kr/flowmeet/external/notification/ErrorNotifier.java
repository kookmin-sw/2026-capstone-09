package kr.flowmeet.external.notification;

public interface ErrorNotifier {

    void notifyError(
            String title,
            String description,
            Long userId,
            String requestBody,
            Throwable throwable
    );
}
