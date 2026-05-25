package kr.flowmeet.api.common.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestBodyCachingFilter extends OncePerRequestFilter {

    private static final int CACHE_LIMIT_BYTES = 65_536;
    private static final String MULTIPART_PREFIX = "multipart/";

    @Override
    protected void doFilterInternal(
            final HttpServletRequest request,
            final HttpServletResponse response,
            final FilterChain filterChain
    ) throws ServletException, IOException {
        if (isMultipart(request)) {
            filterChain.doFilter(request, response);
            return;
        }
        ContentCachingRequestWrapper wrapped = new ContentCachingRequestWrapper(request, CACHE_LIMIT_BYTES);
        filterChain.doFilter(wrapped, response);
    }

    private boolean isMultipart(final HttpServletRequest request) {
        String contentType = request.getContentType();
        return contentType != null && contentType.toLowerCase().startsWith(MULTIPART_PREFIX);
    }
}
