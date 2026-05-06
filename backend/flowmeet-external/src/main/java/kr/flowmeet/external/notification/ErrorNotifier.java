package kr.flowmeet.external.notification;

public interface ErrorNotifier {

    void notifyError(
            String title,
            String description,
            String requestBody,
            Throwable throwable
    );
}
