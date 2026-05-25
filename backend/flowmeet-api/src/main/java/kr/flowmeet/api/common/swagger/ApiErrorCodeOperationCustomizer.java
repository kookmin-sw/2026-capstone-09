package kr.flowmeet.api.common.swagger;

import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.IntegerSchema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import java.util.LinkedHashSet;
import kr.flowmeet.common.exception.ErrorCode;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class ApiErrorCodeOperationCustomizer implements OperationCustomizer {

    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {
        Set<ErrorCode> errorCodes = new LinkedHashSet<>();

        collectFromApiErrorCodes(handlerMethod, errorCodes);
        collectFromApiErrorCode(handlerMethod, errorCodes);

        if (errorCodes.isEmpty()) {
            return operation;
        }

        Map<Integer, List<ErrorCode>> grouped = errorCodes.stream()
                .collect(Collectors.groupingBy(
                        ec -> ec.getHttpStatus().value(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        ApiResponses responses = operation.getResponses();
        if (responses == null) {
            responses = new ApiResponses();
            operation.setResponses(responses);
        }

        for (Map.Entry<Integer, List<ErrorCode>> entry : grouped.entrySet()) {
            int statusCode = entry.getKey();
            List<ErrorCode> codes = entry.getValue();
            String statusStr = String.valueOf(statusCode);

            ApiResponse apiResponse = responses.computeIfAbsent(statusStr, k -> new ApiResponse());
            apiResponse.setDescription(HttpStatus.valueOf(statusCode).getReasonPhrase());

            MediaType mediaType = new MediaType();
            mediaType.setSchema(buildErrorSchema());

            if (codes.size() == 1) {
                mediaType.setExample(buildExampleValue(codes.getFirst()));
            } else {
                for (ErrorCode ec : codes) {
                    Example example = new Example();
                    example.setSummary(ec.name());
                    example.setValue(buildExampleValue(ec));
                    mediaType.addExamples(ec.name(), example);
                }
            }

            Content content = apiResponse.getContent();
            if (content == null) {
                content = new Content();
                apiResponse.setContent(content);
            }
            content.addMediaType(org.springframework.http.MediaType.APPLICATION_JSON_VALUE, mediaType);
        }

        return operation;
    }

    private void collectFromApiErrorCodes(HandlerMethod handlerMethod, Set<ErrorCode> result) {
        ApiErrorCodes annotation = handlerMethod.getMethodAnnotation(ApiErrorCodes.class);
        if (annotation == null) {
            return;
        }

        for (Class<? extends ErrorCode> clazz : annotation.value()) {
            if (clazz.isEnum()) {
                result.addAll(Arrays.asList(clazz.getEnumConstants()));
            }
        }
    }

    private void collectFromApiErrorCode(HandlerMethod handlerMethod, Set<ErrorCode> result) {
        ApiErrorCode single = handlerMethod.getMethodAnnotation(ApiErrorCode.class);
        ApiErrorCodeGroup group = handlerMethod.getMethodAnnotation(ApiErrorCodeGroup.class);

        List<ApiErrorCode> annotations = new ArrayList<>();
        if (single != null) {
            annotations.add(single);
        }
        if (group != null) {
            annotations.addAll(Arrays.asList(group.value()));
        }

        for (ApiErrorCode annotation : annotations) {
            Class<? extends ErrorCode> clazz = annotation.code();
            if (!clazz.isEnum()) {
                continue;
            }

            ErrorCode[] constants = clazz.getEnumConstants();
            String[] names = annotation.names();

            if (names.length == 0) {
                result.addAll(Arrays.asList(constants));
            } else {
                Set<String> nameSet = Set.of(names);
                for (ErrorCode ec : constants) {
                    if (nameSet.contains(ec.name())) {
                        result.add(ec);
                    }
                }
            }
        }
    }

    private ObjectSchema buildErrorSchema() {
        ObjectSchema dataSchema = new ObjectSchema();
        dataSchema.setNullable(true);

        ObjectSchema schema = new ObjectSchema();
        schema.addProperty("status", new IntegerSchema());
        schema.addProperty("code", new StringSchema());
        schema.addProperty("message", new StringSchema());
        schema.addProperty("data", dataSchema);
        return schema;
    }

    private Map<String, Object> buildExampleValue(ErrorCode errorCode) {
        Map<String, Object> example = new LinkedHashMap<>();
        example.put("status", errorCode.getHttpStatus().value());
        example.put("code", errorCode.name());
        example.put("message", errorCode.getMessage());
        example.put("data", null);
        return example;
    }
}
