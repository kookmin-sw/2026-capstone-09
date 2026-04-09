package kr.flowmeet.api.common.dto;

import java.util.List;
import java.util.function.Function;
import org.springframework.data.domain.Page;

public record PageResponse<T>(
        List<T> content,
        int currentPage,
        int totalPages,
        long totalElements,
        boolean hasNext
) {
    public static <T> PageResponse<T> from(final Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.hasNext()
        );
    }

    public <R> PageResponse<R> map(final Function<T, R> mapper) {
        return new PageResponse<>(
                content.stream().map(mapper).toList(),
                currentPage,
                totalPages,
                totalElements,
                hasNext
        );
    }
}
