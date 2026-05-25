package kr.flowmeet.domain.chat.service;

import java.util.List;
import kr.flowmeet.domain.chat.entity.ChatMessage;
import kr.flowmeet.domain.chat.entity.ChatMessageType;
import kr.flowmeet.domain.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public List<ChatMessage> findAllByChatSessionId(final Long chatSessionId, final Long cursorId, final int size) {
        return chatMessageRepository.findAllByChatSessionId(chatSessionId, cursorId, size);
    }

    @Transactional
    public ChatMessage create(final Long chatSessionId, final String content) {
        return chatMessageRepository.save(
                ChatMessage.builder()
                        .chatSessionId(chatSessionId)
                        .content(content)
                        .messageType(ChatMessageType.USER)
                        .build()
        );
    }

    @Transactional
    public ChatMessage createAiResponse(final Long chatSessionId, final String content) {
        return chatMessageRepository.save(
                ChatMessage.builder()
                        .chatSessionId(chatSessionId)
                        .content(content)
                        .messageType(ChatMessageType.AI_RESPONSE)
                        .build()
        );
    }

    @Transactional
    public void softDeleteAllByChatSessionId(final Long chatSessionId) {
        chatMessageRepository.softDeleteAllByChatSessionId(chatSessionId);
    }
}