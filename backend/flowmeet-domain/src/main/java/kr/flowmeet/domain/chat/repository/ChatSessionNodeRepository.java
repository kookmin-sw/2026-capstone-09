package kr.flowmeet.domain.chat.repository;

import java.util.List;
import java.util.Optional;
import kr.flowmeet.domain.chat.entity.ChatSessionNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatSessionNodeRepository extends JpaRepository<ChatSessionNode, Long> {

    @Query("SELECT csn FROM ChatSessionNode csn JOIN FETCH csn.node WHERE csn.chatSessionId = :chatSessionId")
    List<ChatSessionNode> findAllWithNodeByChatSessionId(@Param("chatSessionId") Long chatSessionId);

    List<ChatSessionNode> findAllByChatSessionId(Long chatSessionId);

    Optional<ChatSessionNode> findByChatSessionIdAndNodeId(Long chatSessionId, Long nodeId);

    boolean existsByChatSessionIdAndNodeId(Long chatSessionId, Long nodeId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM ChatSessionNode n WHERE n.chatSessionId = :chatSessionId")
    int deleteAllByChatSessionId(@Param("chatSessionId") Long chatSessionId);
}