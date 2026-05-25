# flowmeet-domain

도메인 모듈. JPA 엔티티, Repository, 도메인 서비스, 비즈니스 예외를 담당한다.

## 의존 모듈

- flowmeet-common

## 주요 의존성

- Spring Data JPA
- Flyway (PostgreSQL 마이그레이션)
- H2 / PostgreSQL 드라이버

## 패키지 구조

```
kr.flowmeet.domain/
├── common/
│   ├── BaseTimeEntity.java            # createdAt, updatedAt, deletedAt (soft delete)
│   ├── BaseCreatedTimeEntity.java     # createdAt만 필요한 엔티티용
│   └── config/
│       ├── JpaAuditingConfig.java     # @EnableJpaAuditing
│       └── JpaConfig.java            # @EnableJpaRepositories, @EntityScan
├── exception/
│   └── BusinessException.java        # 도메인 비즈니스 예외 (CustomException 상속)
├── user/
│   ├── entity/
│   │   ├── User.java                  # 사용자 (소셜 로그인, 이메일, 프로필)
│   │   └── SocialProvider.java        # GOOGLE, KAKAO
│   ├── repository/
│   │   └── UserRepository.java
│   ├── service/
│   │   └── UserService.java
│   └── exception/
│       └── UserErrorCode.java
├── project/
│   └── entity/
│       ├── Project.java               # 프로젝트
│       ├── ProjectMember.java         # 프로젝트 멤버 (역할 기반)
│       ├── ProjectMemberRole.java     # OWNER, MEMBER, VIEWER
│       └── ProjectUrl.java            # 프로젝트 관련 URL
├── node/
│   └── entity/
│       ├── Node.java                  # 작업 노드 (계층 구조, 상태, 노트)
│       ├── NodeStatus.java            # WAITING, IN_PROGRESS, DONE
│       ├── NodeAssignee.java          # 노드 담당자
│       ├── NodeTag.java               # 노드-태그 매핑
│       ├── Tag.java                   # 태그 (이름, 색상)
│       ├── Edge.java                  # 노드 간 연결선
│       └── EdgeLineType.java          # SOLID, DASHED
├── meeting/
│   └── entity/
│       ├── Meeting.java               # 회의 (노드 연결, 상태, 요약)
│       ├── MeetingStatus.java         # SCHEDULED, IN_PROGRESS, ENDED
│       └── MeetingParticipant.java    # 회의 참가자
├── notification/
│   └── entity/
│       ├── Notification.java          # 알림 (사용자, 노드, 읽음 상태)
│       ├── NotificationType.java      # 알림 유형 enum
│       └── NotificationSetting.java   # 알림 설정 (회의/노드/푸시/이메일 토글)
├── file/
│   └── entity/
│       ├── FileInformation.java       # 파일 메타데이터 (이름, 확장자, 크기, URL)
│       └── FileDomainType.java        # 파일 도메인 유형 enum
└── mock/
    └── service/
        └── MockService.java           # 테스트용 Mock 서비스
```

## 도메인 모델 관계

```
Project ─┬─ ProjectMember ── User
         ├─ ProjectUrl
         └─ Node ─┬─ NodeAssignee ── User
                   ├─ NodeTag ── Tag
                   ├─ Edge (source ↔ target)
                   ├─ Meeting ── MeetingParticipant ── User
                   └─ Notification ── User
```

## Base 엔티티

| 클래스 | 필드 | 용도 |
|--------|------|------|
| `BaseTimeEntity` | createdAt, updatedAt, deletedAt | soft delete 포함 엔티티 |
| `BaseCreatedTimeEntity` | createdAt | 생성 시각만 필요한 엔티티 |
