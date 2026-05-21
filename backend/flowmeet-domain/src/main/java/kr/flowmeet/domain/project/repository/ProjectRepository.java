package kr.flowmeet.domain.project.repository;

import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.project.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Project p WHERE p.id = :id")
    Optional<Project> findByIdWithLock(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query("""
            UPDATE Project p
            SET p.lastActivityAt = :time
            WHERE p.id = :id
              AND (p.lastActivityAt IS NULL OR p.lastActivityAt < :time)
            """)
    void touchLastActivityAt(@Param("id") Long id, @Param("time") LocalDateTime time);
}
