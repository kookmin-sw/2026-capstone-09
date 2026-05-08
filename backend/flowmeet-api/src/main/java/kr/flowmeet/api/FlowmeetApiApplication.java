package kr.flowmeet.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication(scanBasePackages = "kr.flowmeet")
@ConfigurationPropertiesScan(basePackages = "kr.flowmeet")
public class FlowmeetApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlowmeetApiApplication.class, args);
    }
}
