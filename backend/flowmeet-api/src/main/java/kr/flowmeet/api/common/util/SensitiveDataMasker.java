package kr.flowmeet.api.common.util;

import java.util.regex.Pattern;

public final class SensitiveDataMasker {

    private static final Pattern JSON_SENSITIVE_PATTERN = Pattern.compile(
            "(\"(?:password|code|refreshToken)\"\\s*:\\s*)\"[^\"]*\"",
            Pattern.CASE_INSENSITIVE
    );

    private static final String MASKED_REPLACEMENT = "$1\"***\"";

    private SensitiveDataMasker() {
    }

    public static String mask(final String body) {
        if (body == null || body.isBlank()) {
            return body;
        }
        return JSON_SENSITIVE_PATTERN.matcher(body).replaceAll(MASKED_REPLACEMENT);
    }
}
