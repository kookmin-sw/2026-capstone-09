package kr.flowmeet.api.common.dto;

import java.util.List;
import java.util.function.Function;

public record CursorSliceResponse<T>(
        List<T> content,
        int size,
        boolean hasNext,
        Long nextCursorId,
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
