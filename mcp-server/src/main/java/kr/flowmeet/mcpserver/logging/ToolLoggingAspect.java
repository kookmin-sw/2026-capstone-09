package kr.flowmeet.mcpserver.logging;

import java.util.Arrays;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class ToolLoggingAspect {

    @Around("@annotation(tool)")
    public Object logToolCall(
            ProceedingJoinPoint joinPoint,
            Tool tool
    ) throws Throwable {
        String toolName = tool.name().isEmpty()
                ? joinPoint.getSignature().getName()
                : tool.name();
        Object[] args = joinPoint.getArgs();

        log.info("[Tool] {} 호출 — args: {}", toolName, Arrays.toString(args));
        long startedAt = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long elapsed = System.currentTimeMillis() - startedAt;
            log.info("[Tool] {} 완료 — {}ms | result: {}", toolName, elapsed, result);
            return result;
        } catch (Throwable e) {
            long elapsed = System.currentTimeMillis() - startedAt;
            log.error("[Tool] {} 실패 — {}ms | error: {}", toolName, elapsed, e.getMessage(), e);
            throw e;
        }
    }
}
