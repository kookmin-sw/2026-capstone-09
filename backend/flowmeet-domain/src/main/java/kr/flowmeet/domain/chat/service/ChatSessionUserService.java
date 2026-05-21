package kr.flowmeet.domain.chat.service;

import kr.flowmeet.domain.chat.entity.ChatSessionUser;
import kr.flowmeet.domain.chat.repository.ChatSessionUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatSessionUserService {

    private final ChatSessionUserRepository chatSessionUserRepository;

    @Transactional
    public void register(final Long chatSessionId, final Long userId) {
        if (chatSessionUserRepository.existsByChatSessionIdAndUserId(chatSessionId, userId)) {
            return;
        }
        chatSessionUserRepository.save(
                ChatSessionUser.builder()
                        .chatSessionId(chatSessionId)
                        .userId(userId)
                        .build()
        );
    }

    @Transactional
    public void deleteAllByChatSessionId(final Long chatSessionId) {
        chatSessionUserRepository.deleteAllByChatSessionId(chatSessionId);
    }
}