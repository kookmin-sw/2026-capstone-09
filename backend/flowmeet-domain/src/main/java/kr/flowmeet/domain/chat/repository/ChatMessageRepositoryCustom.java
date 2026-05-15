package kr.flowmeet.domain.chat.repository;

import java.util.List;
import kr.flowmeet.domain.chat.entity.ChatMessage;

public interface ChatMessageRepositoryCustom {

    List<ChatMessage> findAllByChatSessionId(Long chatSessionId, Long cursorId, int size);
}