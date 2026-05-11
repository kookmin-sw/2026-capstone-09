package kr.flowmeet.external.ai.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@RequiredArgsConstructor
@ConfigurationProperties(prefix = "cloud.aws.ai")
public class NodeAnalysisProperties {

    private final String endpointUrl;
}