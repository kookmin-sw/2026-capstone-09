package kr.flowmeet.api.common.swagger;

import kr.flowmeet.common.response.SuccessCode;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ApiSuccessCode {

    Class<? extends SuccessCode> code();

    String name();
}
