package kr.flowmeet.domain.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.project.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {
}
