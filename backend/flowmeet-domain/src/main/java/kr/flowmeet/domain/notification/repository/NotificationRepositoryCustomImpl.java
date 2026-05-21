package kr.flowmeet.domain.notification.repository;

import static kr.flowmeet.domain.notification.entity.QNotification.notification;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import kr.flowmeet.domain.notification.entity.Notification;

@RequiredArgsConstructor
public class NotificationRepositoryCustomImpl implements NotificationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Notification> findAllByUserId(
            final Long userId,
            final Boolean isRead,
            final Long cursorId,
            final int size
    ) {
        return queryFactory
                .selectFrom(notification)
                .where(
                        notification.userId.eq(userId),
                        isReadEq(isRead),
                        afterCursor(cursorId)
                )
                .orderBy(notification.id.desc())
                .limit(size + 1L)
                .fetch();
    }

    private BooleanExpression isReadEq(final Boolean isRead) {
        if (isRead == null) {
            return null;
        }
        return notification.isRead.eq(isRead);
    }

    private BooleanExpression afterCursor(final Long cursorId) {
        if (cursorId == null) {
            return null;
        }
        return notification.id.lt(cursorId);
    }
}
