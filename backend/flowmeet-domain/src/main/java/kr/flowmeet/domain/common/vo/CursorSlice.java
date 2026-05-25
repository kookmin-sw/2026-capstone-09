package kr.flowmeet.domain.common.vo;

import org.springframework.util.Assert;

public record CursorSlice(
        Long cursorId,
        String cursorValue,
        int size
) {

    public static CursorSlice of(Long cursorId, String cursorValue, int size) {
        Assert.isTrue(size > 0, "size는 0보다 커야 합니다.");

        return new CursorSlice(cursorId, cursorValue, size);
    }

    public static CursorSlice of(Long cursorId, int size) {
        return CursorSlice.of(cursorId, null, size);
    }
}
