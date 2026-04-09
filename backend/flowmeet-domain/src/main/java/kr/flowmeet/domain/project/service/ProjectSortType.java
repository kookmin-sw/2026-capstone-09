package kr.flowmeet.domain.project.service;

import org.springframework.data.domain.Sort;

public enum ProjectSortType {
    LATEST(Sort.by(Sort.Direction.DESC, "updatedAt")),
    NAME(Sort.by(Sort.Direction.ASC, "name"));

    private final Sort sort;

    ProjectSortType(final Sort sort) {
        this.sort = sort;
    }

    public Sort toSort() {
        return sort;
    }
}
