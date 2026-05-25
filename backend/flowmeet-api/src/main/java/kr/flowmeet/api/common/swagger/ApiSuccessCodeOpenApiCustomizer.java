package kr.flowmeet.api.common.swagger;

import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import org.springdoc.core.customizers.GlobalOpenApiCustomizer;
import org.springframework.http.HttpStatus;

import java.util.Map;

public class ApiSuccessCodeOpenApiCustomizer implements GlobalOpenApiCustomizer {

    private static final String SUCCESS_STATUS_KEY = String.valueOf(HttpStatus.OK.value());

    @Override
    public void customise(OpenAPI openApi) {
        if (openApi.getPaths() == null) {
            return;
        }

        openApi.getPaths().values().forEach(pathItem ->
                pathItem.readOperations().forEach(operation -> processOperation(operation, openApi))
        );
    }

    private void processOperation(Operation operation, OpenAPI openApi) {
        if (operation.getExtensions() == null) {
            return;
        }
        Object ext = operation.getExtensions().get(ApiSuccessCodeOperationCustomizer.EXTENSION_KEY);
        if (!(ext instanceof Map<?, ?> meta)) {
            return;
        }

        String code = String.valueOf(meta.get("code"));
        String message = String.valueOf(meta.get("message"));

        ApiResponses responses = operation.getResponses();
        if (responses == null) {
            return;
        }

        ApiResponse apiResponse = responses.get(SUCCESS_STATUS_KEY);
        if (apiResponse == null) {
            return;
        }

        apiResponse.setDescription(HttpStatus.OK.getReasonPhrase());

        Content content = apiResponse.getContent();
        if (content == null) {
            return;
        }

        for (MediaType mediaType : content.values()) {
            applyToMediaType(mediaType, openApi, code, message);
        }

        operation.getExtensions().remove(ApiSuccessCodeOperationCustomizer.EXTENSION_KEY);
    }

    private void applyToMediaType(MediaType mediaType, OpenAPI openApi, String code, String message) {
        Schema<?> originalSchema = mediaType.getSchema();
        if (originalSchema == null) {
            return;
        }

        Schema<?> resolved = resolveRef(originalSchema, openApi);
        Schema<?> cloned = deepClone(resolved);
        if (cloned == null || cloned.getProperties() == null) {
            return;
        }

        applyPropertyExample(cloned, "status", HttpStatus.OK.value());
        applyPropertyExample(cloned, "code", code);
        applyPropertyExample(cloned, "message", message);

        mediaType.setSchema(cloned);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private void applyPropertyExample(Schema<?> objectSchema, String propertyName, Object value) {
        Map<String, Schema> properties = objectSchema.getProperties();
        Schema<?> property = properties.get(propertyName);
        if (property == null) {
            return;
        }
        Schema<?> propertyClone = deepClone(property);
        if (propertyClone == null) {
            return;
        }
        ((Schema) propertyClone).setExample(value);
        properties.put(propertyName, propertyClone);
    }

    private Schema<?> resolveRef(Schema<?> schema, OpenAPI openApi) {
        String ref = schema.get$ref();
        if (ref == null) {
            return schema;
        }
        if (openApi.getComponents() == null || openApi.getComponents().getSchemas() == null) {
            return schema;
        }
        String name = ref.substring(ref.lastIndexOf('/') + 1);
        Schema<?> resolved = openApi.getComponents().getSchemas().get(name);
        return resolved != null ? resolved : schema;
    }

    private Schema<?> deepClone(Schema<?> original) {
        if (original == null) {
            return null;
        }
        return Json.mapper().convertValue(original, Schema.class);
    }
}
