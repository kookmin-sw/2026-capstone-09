package kr.flowmeet.domain.chat.repository;

import static kr.flowmeet.domain.chat.entity.QChatSession.chatSession;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import kr.flowmeet.domain.chat.entity.ChatSession;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ChatSessionRepositoryCustomImpl implements ChatSessionRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ChatSession> findAllByProjectId(
            final Long projectId,
            final String search,
            final Long cursorId,
            final int size
    ) {
        return queryFactory
                .selectFrom(chatSession)
                .where(
                        chatSession.projectId.eq(projectId),
                        titleContains(search),
                        afterCursor(cursorId)
                )
                .orderBy(chatSession.updatedAt.desc(), chatSession.id.desc())
                .limit(size + 1L)
                .fetch();
    }

    private BooleanExpression titleContains(final String search) {
        if (search == null || search.isBlank()) {
            return null;
        }
        return chatSession.title.containsIgnoreCase(search);
    }

    private BooleanExpression afterCursor(final Long cursorId) {
        if (cursorId == null) {
            return null;
        }
        return chatSession.id.lt(cursorId);
    }
}