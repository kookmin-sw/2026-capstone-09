package kr.flowmeet.auth.resolver;

import java.util.Objects;
import kr.flowmeet.auth.annotation.UserId;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class UserIdArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(final MethodParameter parameter) {
        boolean hasAnnotation = parameter.hasParameterAnnotation(UserId.class);
        Class<?> parameterType = parameter.getParameterType();
        boolean isLong = parameterType.equals(Long.class);
        return hasAnnotation && isLong;
    }

    @Override
    public Object resolveArgument(final MethodParameter parameter, final ModelAndViewContainer mavContainer,
                                            final NativeWebRequest webRequest, final WebDataBinderFactory binderFactory)
            throws Exception {
        return Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
    }
}
