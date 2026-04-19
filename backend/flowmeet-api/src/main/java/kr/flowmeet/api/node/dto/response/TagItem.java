package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.node.entity.Tag;

@Schema(description = "태그 정보")
public record TagItem(
        @Schema(description = "태그 ID", example = "5")
        Long tagId,
        @Schema(description = "태그 이름", example = "긴급")
        String name,
        @Schema(description = "태그 색상(HEX)", example = "#FF5A5F")
        String color
) {

    public static TagItem from(final Tag tag) {
        return new TagItem(tag.getId(), tag.getName(), tag.getColor());
    }
}
