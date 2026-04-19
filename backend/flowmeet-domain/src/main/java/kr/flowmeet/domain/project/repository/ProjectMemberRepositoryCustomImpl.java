package kr.flowmeet.domain.project.repository;

import static kr.flowmeet.domain.project.entity.QProjectMember.projectMember;
import static kr.flowmeet.domain.user.entity.QUser.user;

import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;

@RequiredArgsConstructor
public class ProjectMemberRepositoryCustomImpl implements ProjectMemberRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ProjectMember> findAllByProjectIdOrderByRole(final Long projectId) {
        NumberExpression<Integer> rolePriority = new CaseBuilder()
                .when(projectMember.role.eq(ProjectMemberRole.OWNER)).then(0)
                .when(projectMember.role.eq(ProjectMemberRole.MEMBER)).then(1)
                .when(projectMember.role.eq(ProjectMemberRole.VIEWER)).then(2)
                .otherwise(3);

        return queryFactory
                .selectFrom(projectMember)
                .join(projectMember.user, user).fetchJoin()
                .where(projectMember.projectId.eq(projectId))
                .orderBy(rolePriority.asc(), user.nickname.asc())
                .fetch();
    }
}