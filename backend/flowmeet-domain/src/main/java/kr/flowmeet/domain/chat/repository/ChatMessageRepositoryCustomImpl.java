package kr.flowmeet.domain.chat.repository;

import static kr.flowmeet.domain.chat.entity.QChatMessage.chatMessage;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import kr.flowmeet.domain.chat.entity.ChatMessage;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ChatMessageRepositoryCustomImpl implements ChatMessageRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ChatMessage> findAllByChatSessionId(
            final Long chatSessionId,
            final Long cursorId,
            final int size
    ) {
        return queryFactory
                .selectFrom(chatMessage)
                .where(
                        chatMessage.chatSessionId.eq(chatSessionId),
                        afterCursor(cursorId)
                )
                .orderBy(chatMessage.id.desc())
                .limit(size + 1L)
                .fetch();
    }

    private BooleanExpression afterCursor(final Long cursorId) {
        if (cursorId == null) {
            return null;
        }
        return chatMessage.id.lt(cursorId);
    }
}