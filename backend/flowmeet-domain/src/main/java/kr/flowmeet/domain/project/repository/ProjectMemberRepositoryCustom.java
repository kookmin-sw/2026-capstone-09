package kr.flowmeet.domain.project.repository;

import java.util.List;
import kr.flowmeet.domain.project.entity.ProjectMember;

public interface ProjectMemberRepositoryCustom {

    List<ProjectMember> findAllByProjectIdOrderByRole(Long projectId);
}