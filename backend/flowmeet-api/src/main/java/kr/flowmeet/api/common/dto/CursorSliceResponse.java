package kr.flowmeet.api.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.function.Function;

@Schema(description = "커서 기반 페이지 응답")
public record CursorSliceResponse<T>(
        @Schema(description = "조회된 데이터 목록")
        List<T> content,
        @Schema(description = "요청한 페이지 크기", example = "20")
        int size,
        @Schema(description = "다음 페이지 존재 여부", example = "true")
        boolean hasNext,
        @Schema(description = "다음 페이지 조회용 커서 ID", example = "42")
        Long nextCursorId,
        @Schema(description = "다음 페이지 조회용 커서 값(정렬 기준 값)", example = "2026-04-19T10:00:00")
        String nextCursorValue
) {

    public static <T, R> CursorSliceResponse<R> of(
            final List<T> data,
            final int size,
            final Function<T, R> mapper,
            final Function<T, Long> idExtractor
    ) {
        return of(data, size, mapper, idExtractor, item -> null);
    }

    public static <T, R> CursorSliceResponse<R> of(
            final List<T> fetched,
            final int size,
            final Function<T, R> mapper,
            final Function<T, Long> idExtractor,
            final Function<T, String> valueExtractor
    ) {
        boolean hasNext = fetched.size() > size;
        List<T> content = hasNext ? fetched.subList(0, size) : fetched;

        Long nextCursorId = null;
        String nextCursorValue = null;
        if (hasNext) {
            T last = content.getLast();
            nextCursorId = idExtractor.apply(last);
            nextCursorValue = valueExtractor.apply(last);
        }

        List<R> mapped = content.stream().map(mapper).toList();
        return new CursorSliceResponse<>(mapped, size, hasNext, nextCursorId, nextCursorValue);
    }
}
