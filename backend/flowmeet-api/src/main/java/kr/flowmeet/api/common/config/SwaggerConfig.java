package kr.flowmeet.api.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import kr.flowmeet.api.common.swagger.ApiErrorCodeOperationCustomizer;
import kr.flowmeet.api.common.swagger.ApiSuccessCodeOpenApiCustomizer;
import kr.flowmeet.api.common.swagger.ApiSuccessCodeOperationCustomizer;
import kr.flowmeet.auth.annotation.UserId;
import org.springdoc.core.customizers.GlobalOpenApiCustomizer;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    static {
        SpringDocUtils.getConfig().addAnnotationsToIgnore(UserId.class);
    }

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FlowMeet API")
                        .description("FlowMeet 프로젝트 관리 및 회의 지원 서비스 API")
                        .version("v1"))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }


    @Bean
    public OperationCustomizer apiErrorCodeOperationCustomizer() {
        return new ApiErrorCodeOperationCustomizer();
    }

    @Bean
    public OperationCustomizer apiSuccessCodeOperationCustomizer() {
        return new ApiSuccessCodeOperationCustomizer();
    }

    @Bean
    public GlobalOpenApiCustomizer apiSuccessCodeOpenApiCustomizer() {
        return new ApiSuccessCodeOpenApiCustomizer();
    }
}
