package kr.flowmeet.domain.node.repository;

import static kr.flowmeet.domain.node.entity.QEdge.edge;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import kr.flowmeet.domain.node.entity.Edge;

@RequiredArgsConstructor
public class EdgeRepositoryCustomImpl implements EdgeRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Edge> findAllLinkedByNodeId(final Long projectId, final Long nodeId) {
        return queryFactory
                .selectFrom(edge)
                .innerJoin(edge.startNode).fetchJoin()
                .innerJoin(edge.endNode).fetchJoin()
                .innerJoin(edge.createdBy).fetchJoin()
                .where(
                        projectIdEq(projectId),
                        nodeIdContains(nodeId)
                )
                .fetch();
    }

    private BooleanExpression projectIdEq(final Long projectId) {
        return projectId == null ? null : edge.projectId.eq(projectId);
    }

    private BooleanExpression nodeIdContains(final Long nodeId) {
        return nodeId == null ? null : edge.startNodeId.eq(nodeId).or(edge.endNodeId.eq(nodeId));
    }
}
