package kr.flowmeet.api.node.dto.response;

import kr.flowmeet.domain.node.entity.Tag;

public record TagItem(Long tagId, String name, String color) {

    public static TagItem from(final Tag tag) {
        return new TagItem(tag.getId(), tag.getName(), tag.getColor());
    }
}