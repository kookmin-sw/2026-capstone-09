package kr.flowmeet.api.node.dto.response;

import java.util.List;
import kr.flowmeet.domain.node.entity.Tag;

public record GetAllTagsResponse(List<TagItem> tags) {

    public static GetAllTagsResponse from(final List<Tag> tags) {
        return new GetAllTagsResponse(tags.stream().map(TagItem::from).toList());
    }
}
