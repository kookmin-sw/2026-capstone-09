package kr.flowmeet.external.notification;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class NoOpErrorNotifier implements ErrorNotifier {

    @Override
    public void notifyError(
            final String title,
            final String description,
            final String requestBody,
            final Throwable throwable
    ) {
        log.debug("[NoOpErrorNotifier] notifyError skipped. title={}", title);
    }
}
