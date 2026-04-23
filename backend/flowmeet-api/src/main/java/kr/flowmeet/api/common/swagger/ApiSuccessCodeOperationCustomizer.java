package kr.flowmeet.api.common.swagger;

import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import kr.flowmeet.common.response.SuccessCode;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

public class ApiSuccessCodeOperationCustomizer implements OperationCustomizer {

    private static final String SUCCESS_STATUS_KEY = String.valueOf(HttpStatus.OK.value());

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

        ApiResponses responses = operation.getResponses();
        if (responses == null) {
            responses = new ApiResponses();
            operation.setResponses(responses);
        }

        ApiResponse apiResponse = resolveSuccessResponse(responses);
        apiResponse.setDescription(HttpStatus.OK.getReasonPhrase());

        Content content = apiResponse.getContent();
        if (content == null) {
            content = new Content();
            apiResponse.setContent(content);
        }

        MediaType mediaType = content.get(org.springframework.http.MediaType.APPLICATION_JSON_VALUE);
        if (mediaType == null) {
            mediaType = new MediaType();
            content.addMediaType(org.springframework.http.MediaType.APPLICATION_JSON_VALUE, mediaType);
        }
        mediaType.setExample(buildExampleValue(target));

        return operation;
    }

    private ApiResponse resolveSuccessResponse(ApiResponses responses) {
        ApiResponse existing = responses.get(SUCCESS_STATUS_KEY);
        if (existing != null) {
            return existing;
        }

        // springdoc이 생성한 2xx 슬롯이 다른 키(e.g. "default")로 있을 수 있어 재사용
        ApiResponse fallback = responses.entrySet().stream()
                .filter(e -> e.getKey().startsWith("2") || "default".equals(e.getKey()))
                .findFirst()
                .map(Map.Entry::getValue)
                .orElse(null);

        if (fallback != null) {
            responses.addApiResponse(SUCCESS_STATUS_KEY, fallback);
            return fallback;
        }

        ApiResponse created = new ApiResponse();
        responses.addApiResponse(SUCCESS_STATUS_KEY, created);
        return created;
    }

    private Map<String, Object> buildExampleValue(SuccessCode successCode) {
        Map<String, Object> example = new LinkedHashMap<>();
        example.put("status", HttpStatus.OK.value());
        example.put("code", successCode.name());
        example.put("message", successCode.getMessage());
        example.put("data", null);
        return example;
    }
}
