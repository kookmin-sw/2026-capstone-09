package kr.flowmeet.api.common.swagger;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FlowMeet API")
                        .description("FlowMeet 프로젝트 관리 및 회의 지원 서비스 API")
                        .version("v1"));
    }

    @Bean
    public OperationCustomizer apiErrorCodeOperationCustomizer() {
        return new ApiErrorCodeOperationCustomizer();
    }
}
