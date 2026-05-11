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
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.signer.Aws4Signer;
import software.amazon.awssdk.auth.signer.params.Aws4SignerParams;
import software.amazon.awssdk.http.SdkHttpFullRequest;
import software.amazon.awssdk.http.SdkHttpMethod;
import software.amazon.awssdk.regions.Region;

@Slf4j
@Component
@RequiredArgsConstructor
public class NodeAnalysisClient {

    private static final String SIGNING_NAME = "execute-api";
    private static final Region SIGNING_REGION = Region.AP_NORTHEAST_2;

    private final RestClient nodeAnalysisRestClient;
    private final NodeAnalysisProperties properties;
    private final AwsCredentialsProvider awsCredentialsProvider;

    public NodeAnalysisResult analyze(final String fileContent) {
        URI uri = URI.create(properties.getEndpointUrl());

        SdkHttpFullRequest signedRequest = signRequest(uri);

        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("file", toByteArrayResource(fileContent));

        log.info("노드 분석 API 호출 - endpoint: {}", properties.getEndpointUrl());

        try {
            return nodeAnalysisRestClient.post()
                    .uri(uri)
                    .headers(headers -> signedRequest.headers().forEach((key, values) ->
                            values.forEach(value -> headers.add(key, value))
                    ))
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(bodyBuilder.build())
                    .retrieve()
                    .body(NodeAnalysisResult.class);
        } catch (Exception e) {
            log.error("노드 분석 API 호출 실패", e);
            throw new ExternalException(NodeAnalysisErrorCode.NODE_ANALYSIS_FAILED);
        }
    }

    private SdkHttpFullRequest signRequest(final URI uri) {
        Aws4Signer signer = Aws4Signer.create();

        SdkHttpFullRequest unsignedRequest = SdkHttpFullRequest.builder()
                .method(SdkHttpMethod.POST)
                .uri(uri)
                .build();

        Aws4SignerParams signerParams = Aws4SignerParams.builder()
                .awsCredentials(awsCredentialsProvider.resolveCredentials())
                .signingName(SIGNING_NAME)
                .signingRegion(SIGNING_REGION)
                .build();

        return signer.sign(unsignedRequest, signerParams);
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