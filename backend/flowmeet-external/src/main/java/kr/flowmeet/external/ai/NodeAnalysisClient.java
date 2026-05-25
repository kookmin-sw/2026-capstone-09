package kr.flowmeet.external.ai;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import kr.flowmeet.external.ai.config.NodeAnalysisProperties;
import kr.flowmeet.external.exception.ExternalException;
import kr.flowmeet.external.ai.dto.NodeAnalysisResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
@RequiredArgsConstructor
public class NodeAnalysisClient {

    private final RestClient nodeAnalysisRestClient;
    private final NodeAnalysisProperties properties;

    public NodeAnalysisResult analyze(final String fileContent) {
        URI uri = URI.create(properties.getEndpointUrl());

        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("file", toByteArrayResource(fileContent));

        log.info("노드 분석 API 호출 - endpoint: {}", properties.getEndpointUrl());

        try {
            return nodeAnalysisRestClient.post()
                    .uri(uri)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(bodyBuilder.build())
                    .retrieve()
                    .body(NodeAnalysisResult.class);
        } catch (Exception e) {
            log.error("노드 분석 API 호출 실패", e);
            throw new ExternalException(NodeAnalysisErrorCode.NODE_ANALYSIS_FAILED);
        }
    }

    private ByteArrayResource toByteArrayResource(final String content) {
        return new ByteArrayResource(content.getBytes(StandardCharsets.UTF_8)) {
            @Override
            public String getFilename() {
                return "analysis.txt";
            }
        };
    }
}