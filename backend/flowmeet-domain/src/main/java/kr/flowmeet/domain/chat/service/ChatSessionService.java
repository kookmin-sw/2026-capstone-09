package kr.flowmeet.domain.chat.service;

import java.util.List;
import kr.flowmeet.domain.chat.entity.ChatSession;
import kr.flowmeet.domain.chat.exception.ChatErrorCode;
import kr.flowmeet.domain.chat.repository.ChatSessionRepository;
import kr.flowmeet.domain.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatSessionService {

    private static final String DEFAULT_TITLE = "새 채팅";

    private final ChatSessionRepository chatSessionRepository;

    public ChatSession findByIdAndProjectId(final Long chatSessionId, final Long projectId) {
        return chatSessionRepository.findByIdAndProjectId(chatSessionId, projectId)
                .orElseThrow(() -> new BusinessException(ChatErrorCode.CHAT_SESSION_NOT_FOUND));
    }

    public void validateCreatedBy(final ChatSession session, final Long userId) {
        if (!session.isCreatedBy(userId)) {
            throw new BusinessException(ChatErrorCode.CHAT_SESSION_ACCESS_DENIED);
        }
    }

    public List<ChatSession> findAllByProjectId(final Long projectId, final String search,
                                                    final Long cursorId, final int size) {
        return chatSessionRepository.findAllByProjectId(projectId, search, cursorId, size);
    }

    @Transactional
    public ChatSession create(final Long projectId, final Long userId, final String title) {
        String sessionTitle = (title != null && !title.isBlank()) ? title : DEFAULT_TITLE;

        return chatSessionRepository.save(
                ChatSession.builder()
                        .projectId(projectId)
                        .createdById(userId)
                        .title(sessionTitle)
                        .build()
        );
    }

    @Transactional
    public void delete(final ChatSession chatSession) {
        chatSessionRepository.delete(chatSession);
    }
}
