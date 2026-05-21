package kr.flowmeet.domain.node.service;

import com.querydsl.core.types.OrderSpecifier;
import kr.flowmeet.domain.node.entity.QNode;

public enum NodeSortType {
    LATEST(QNode.node.updatedAt.desc()),
    NAME(QNode.node.title.asc());

    private final OrderSpecifier<?> orderSpecifier;

    NodeSortType(final OrderSpecifier<?> orderSpecifier) {
        this.orderSpecifier = orderSpecifier;
    }

    public OrderSpecifier<?> toOrderSpecifier() {
        return orderSpecifier;
    }
}
