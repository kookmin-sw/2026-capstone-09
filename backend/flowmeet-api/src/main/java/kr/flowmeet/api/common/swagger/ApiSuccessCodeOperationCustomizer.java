package kr.flowmeet.api.common.swagger;

import io.swagger.v3.oas.models.Operation;
import kr.flowmeet.common.response.SuccessCode;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.web.method.HandlerMethod;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

public class ApiSuccessCodeOperationCustomizer implements OperationCustomizer {

    static final String EXTENSION_KEY = "x-flowmeet-success-code";

    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {
        ApiSuccessCode annotation = handlerMethod.getMethodAnnotation(ApiSuccessCode.class);
        if (annotation == null) {
            return operation;
        }

        Class<? extends SuccessCode> codeClass = annotation.code();
        if (!codeClass.isEnum()) {
            return operation;
        }

        SuccessCode target = Arrays.stream(codeClass.getEnumConstants())
                .filter(sc -> sc.name().equals(annotation.name()))
                .findFirst()
                .orElse(null);
        if (target == null) {
            return operation;
        }

        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("code", target.name());
        meta.put("message", target.getMessage());
        operation.addExtension(EXTENSION_KEY, meta);

        return operation;
    }
}
