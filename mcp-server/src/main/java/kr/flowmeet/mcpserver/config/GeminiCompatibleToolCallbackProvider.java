package kr.flowmeet.mcpserver.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.definition.ToolDefinition;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class GeminiCompatibleToolCallbackProvider implements ToolCallbackProvider {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final ToolCallbackProvider delegate;

    @Override
    public ToolCallback[] getToolCallbacks() {
        ToolCallback[] callbacks = delegate.getToolCallbacks();
        ToolCallback[] cleaned = new ToolCallback[callbacks.length];

        for (int i = 0; i < callbacks.length; i++) {
            cleaned[i] = new CleanedToolCallback(callbacks[i]);
        }
        return cleaned;
    }

    private static class CleanedToolCallback implements ToolCallback {

        private final ToolCallback delegate;

        CleanedToolCallback(ToolCallback delegate) {
            this.delegate = delegate;
        }

        @Override
        public ToolDefinition getToolDefinition() {
            ToolDefinition original = delegate.getToolDefinition();
            String cleanedSchema = removeAdditionalProperties(original.inputSchema());

            return ToolDefinition.builder()
                    .name(original.name())
                    .description(original.description())
                    .inputSchema(cleanedSchema)
                    .build();
        }

        @Override
        public String call(String toolInput) {
            return delegate.call(toolInput);
        }

        @Override
        public String call(String toolInput, org.springframework.ai.chat.model.ToolContext context) {
            return delegate.call(toolInput, context);
        }
    }

    private static String removeAdditionalProperties(String schema) {
        try {
            Map<String, Object> map = OBJECT_MAPPER.readValue(schema,
                    new TypeReference<Map<String, Object>>() {});
            cleanMap(map);
            return OBJECT_MAPPER.writeValueAsString(map);
        } catch (Exception e) {
            return schema;
        }
    }

    @SuppressWarnings("unchecked")
    private static void cleanMap(Map<String, Object> map) {
        map.remove("additionalProperties");
        map.remove("additional_properties");

        for (Object value : map.values()) {
            if (value instanceof Map) {
                cleanMap((Map<String, Object>) value);
            } else if (value instanceof List) {
                for (Object item : (List<?>) value) {
                    if (item instanceof Map) {
                        cleanMap((Map<String, Object>) item);
                    }
                }
            }
        }
    }
}