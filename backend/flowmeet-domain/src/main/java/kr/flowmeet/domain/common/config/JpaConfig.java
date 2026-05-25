package kr.flowmeet.domain.common.config;

import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "kr.flowmeet.domain")
@EntityScan(basePackages = "kr.flowmeet.domain")
public class JpaConfig {
}
