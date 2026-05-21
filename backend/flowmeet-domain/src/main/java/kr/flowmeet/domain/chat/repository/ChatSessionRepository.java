package kr.flowmeet.domain.chat.repository;

import java.util.Optional;
import kr.flowmeet.domain.chat.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long>, ChatSessionRepositoryCustom {

    Optional<ChatSession> findByIdAndProjectId(Long id, Long projectId);
}