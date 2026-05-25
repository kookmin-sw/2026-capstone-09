package kr.flowmeet.domain.chat.repository;

import kr.flowmeet.domain.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long>, ChatMessageRepositoryCustom {

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ChatMessage m SET m.deletedAt = CURRENT_TIMESTAMP WHERE m.chatSessionId = :chatSessionId AND m.deletedAt IS NULL")
    int softDeleteAllByChatSessionId(@Param("chatSessionId") Long chatSessionId);
}