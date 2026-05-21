package kr.flowmeet.mcpserver.tool;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

class ToolAuthExtractor {

    private ToolAuthExtractor() {
    }

    static String extractAuth() {
        HttpServletRequest request = ((ServletRequestAttributes)
                RequestContextHolder.currentRequestAttributes()).getRequest();
        return request.getHeader("Authorization");
    }
}