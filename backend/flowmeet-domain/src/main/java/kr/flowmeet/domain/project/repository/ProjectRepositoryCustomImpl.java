package kr.flowmeet.domain.project.repository;

import static kr.flowmeet.domain.project.entity.QProject.project;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import kr.flowmeet.domain.common.vo.CursorSlice;
import kr.flowmeet.domain.project.entity.QProjectMember;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;
import kr.flowmeet.domain.project.service.ProjectSortType;

@RequiredArgsConstructor
public class ProjectRepositoryCustomImpl implements ProjectRepositoryCustom {

    private static final QProjectMember memberFilter = new QProjectMember("memberFilter");
    private static final QProjectMember memberCounter = new QProjectMember("memberCounter");

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ProjectWithMemberCountProjection> findAllByUserId(
            final Long userId,
            final String search,
            final ProjectSortType sort,
            final CursorSlice cursorSlice
    ) {
        return queryFactory
                .select(Projections.constructor(
                        ProjectWithMemberCountProjection.class,
                        project,
                        memberCounter.count()
                ))
                .from(project)
                .join(memberFilter).on(memberFilter.projectId.eq(project.id))
                .join(memberCounter).on(memberCounter.projectId.eq(project.id))
                .where(
                        memberFilter.userId.eq(userId),
                        nameContains(search),
                        afterCursor(cursorSlice.cursorId(), cursorSlice.cursorValue(), sort)
                )
                .groupBy(project)
                .orderBy(sort.toOrderSpecifier(), project.id.desc())
                .limit(cursorSlice.size() + 1L)
                .fetch();
    }

    private BooleanExpression nameContains(final String search) {
        if (!StringUtils.hasText(search)) {
            return null;
        }
        return project.name.contains(search);
    }

    private BooleanExpression afterCursor(
            final Long cursorId,
            final String cursorValue,
            final ProjectSortType sort
    ) {
        if (cursorId == null || cursorValue == null) {
            return null;
        }
        return switch (sort) {
            case LATEST -> {
                LocalDateTime cursorTime = LocalDateTime.parse(cursorValue);
                yield project.updatedAt.lt(cursorTime)
                        .or(project.updatedAt.eq(cursorTime).and(project.id.lt(cursorId)));
            }
            case NAME -> project.name.gt(cursorValue)
                    .or(project.name.eq(cursorValue).and(project.id.lt(cursorId)));
        };
    }
}
