package kr.flowmeet.domain.project.service;

import com.querydsl.core.types.OrderSpecifier;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.entity.QProject;

public enum ProjectSortType {
    LATEST(QProject.project.updatedAt.desc()) {
        @Override
        public String extractValue(final Project project) {
            return project.getUpdatedAt().toString();
        }
    },
    NAME(QProject.project.name.asc()) {
        @Override
        public String extractValue(final Project project) {
            return project.getName();
        }
    };

    private final OrderSpecifier<?> orderSpecifier;

    ProjectSortType(final OrderSpecifier<?> orderSpecifier) {
        this.orderSpecifier = orderSpecifier;
    }

    public OrderSpecifier<?> toOrderSpecifier() {
        return orderSpecifier;
    }

    public abstract String extractValue(Project project);
}
