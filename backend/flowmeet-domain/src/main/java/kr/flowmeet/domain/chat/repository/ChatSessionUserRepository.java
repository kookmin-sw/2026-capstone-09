package kr.flowmeet.domain.chat.repository;

import kr.flowmeet.domain.chat.entity.ChatSessionUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatSessionUserRepository extends JpaRepository<ChatSessionUser, Long> {

    boolean existsByChatSessionIdAndUserId(Long chatSessionId, Long userId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM ChatSessionUser u WHERE u.chatSessionId = :chatSessionId")
    int deleteAllByChatSessionId(@Param("chatSessionId") Long chatSessionId);
}