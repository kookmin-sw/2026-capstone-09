package kr.flowmeet.domain.project.entity;

public enum ProjectMemberRole {
    VIEWER, MEMBER, OWNER;

    public boolean isHigherThan(ProjectMemberRole role) {
        return this.ordinal() > role.ordinal();
    }
}
