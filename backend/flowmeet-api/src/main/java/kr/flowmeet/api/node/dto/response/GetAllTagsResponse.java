package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import kr.flowmeet.domain.node.entity.Tag;

@Schema(description = "프로젝트 태그 전체 조회 응답")
public record GetAllTagsResponse(
        @Schema(description = "태그 목록")
        List<TagItem> tags
) {

    public static GetAllTagsResponse from(final List<Tag> tags) {
        return new GetAllTagsResponse(tags.stream().map(TagItem::from).toList());
    }
}
