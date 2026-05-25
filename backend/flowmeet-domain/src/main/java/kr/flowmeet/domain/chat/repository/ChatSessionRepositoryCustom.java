package kr.flowmeet.domain.chat.repository;

import java.util.List;
import kr.flowmeet.domain.chat.entity.ChatSession;

public interface ChatSessionRepositoryCustom {

    List<ChatSession> findAllByUserIdAndProjectId(Long userId, Long projectId, String search, Long cursorId, int size);
}