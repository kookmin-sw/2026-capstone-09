package kr.flowmeet.domain.node.repository;

import static kr.flowmeet.domain.node.entity.QNode.node;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.service.NodeSortType;

@RequiredArgsConstructor
public class NodeRepositoryCustomImpl implements NodeRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Node> findAllByProjectId(final Long projectId, final NodeSortType sort) {
        return queryFactory
                .selectFrom(node)
                .where(node.projectId.eq(projectId))
                .orderBy(sort.toOrderSpecifier(), node.id.asc())
                .fetch();
    }

    @Override
    public List<Node> searchByQuery(final Long projectId, final String query) {
        return queryFactory
                .selectFrom(node)
                .where(
                        node.projectId.eq(projectId),
                        titleOrDescriptionContains(query)
                )
                .orderBy(node.updatedAt.desc())
                .fetch();
    }

    private BooleanExpression titleOrDescriptionContains(final String query) {
        if (!StringUtils.hasText(query)) {
            return null;
        }
        return node.title.contains(query).or(node.description.contains(query));
    }
}