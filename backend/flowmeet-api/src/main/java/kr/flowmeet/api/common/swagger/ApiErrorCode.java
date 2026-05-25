package kr.flowmeet.api.common.swagger;

import kr.flowmeet.common.exception.ErrorCode;

import java.lang.annotation.ElementType;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(ApiErrorCodeGroup.class)
public @interface ApiErrorCode {

    Class<? extends ErrorCode> code();

    String[] names() default {};
}
