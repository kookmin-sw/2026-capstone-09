export const EXAMPLE_PROJECT_SIDEBAR_PROFILE = {
  projectName: '플로밋 기획',
  userName: '황수민',
  userEmail: 'tnals655@naver.com',
  profileImageUrl: 'https://via.placeholder.com/40',
} as const;

export const EXAMPLE_SIDEBAR_ALARM_ITEMS = {
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  data: {
    notifications: [
      {
        notificationId: 1,
        type: 'MEETING_INVITE',
        content: "홍길동님이 '기획 문서 작성' 회의에 초대했습니다.",
        projectId: 1,
        projectName: '캡스톤 프로젝트',
        nodeId: 5,
        isRead: false,
        createdAt: '2026-03-26T10:00:00',
      },
      {
        notificationId: 2,
        type: 'NODE_ASSIGNED',
        content: "홍길동님이 'UI 디자인' 노드에 담당자로 배정했습니다.",
        projectId: 1,
        projectName: '캡스톤 프로젝트',
        nodeId: 3,
        isRead: false,
        createdAt: '2026-03-26T09:30:00',
      },
      {
        notificationId: 3,
        type: 'MEETING_INVITE',
        content:
          "김영희님이 '최종 발표 리허설 및 자료 정리 공유 회의'에 초대했습니다. 회의 전 발표 자료 최신 버전을 꼭 확인해 주세요.",
        projectId: 2,
        projectName: '졸업 전시 준비',
        nodeId: 8,
        isRead: true,
        createdAt: '2026-03-25T16:20:00',
      },
      {
        notificationId: 4,
        type: 'NODE_ASSIGNED',
        content:
          "박철수님이 '프로토타입 사용자 테스트 정리 및 인사이트 문서화 작업' 노드에 담당자로 배정했습니다.",
        projectId: 3,
        projectName: 'UX 개선 프로젝트',
        nodeId: 12,
        isRead: false,
        createdAt: '2026-03-24T11:15:00',
      },
    ],
    unreadCount: 3,
    hasNext: true,
  },
} as const;

export const EXAMPLE_PROJECT_DETAIL_LINKS = [
  { id: 'link-1', label: 'Notion', href: 'https://www.notion.so/' },
  { id: 'link-2', label: 'Figma', href: 'https://www.figma.com/' },
  { id: 'link-3', label: 'Docs', href: 'https://docs.google.com/' },
  { id: 'link-4', label: 'Vercel', href: 'https://vercel.com/dashboard' },
] as const;

export const EXAMPLE_USERS = [
  { nickname: '황수민', email: 'tnals655@kookmin.ac.kr' },
  { nickname: '박건민', email: 'parkkunmin@kookmin.ac.kr' },
  { nickname: '윤신지', email: 'shinji@kookmin.ac.kr' },
  { nicknamename: '백채린', email: 'chaerin@kookmin.ac.kr' },
  { nickname: '윤성욱', email: 'seonguk@kookmin.ac.kr' },
  { nickname: '박정은', email: 'jeongeun@kookmin.ac.kr' },
] as const;

export const EXAMPLE_FLOWCHART_DATA = {
  status: 200,
  code: 'OK',
  message: '요청에 성공했습니다.',
  data: {
    nodes: [
      {
        nodeId: 100,
        parentId: null,
        number: '1',
        title: '로그인 기능 개발',
        description: 'OAuth2 로그인 시스템 구축',
        status: 'IN_PROGRESS' as const,
        sortOrder: 0,
        tags: [
          {
            tagId: 5,
            name: '긴급',
            color: 'RED',
          },
        ],
        assignees: [
          {
            userId: 91,
            nickname: '플로우민',
            email: 'flowmin@flowmeet.kr',
            profileImageUrl: 'https://cdn.flowmeet.kr/profile/91.png',
          },
        ],
        hasMeeting: true,
        childNodeIds: [101, 102],
        updatedAt: '2026-04-19T10:15:30',
      },
      {
        nodeId: 101,
        parentId: 100,
        number: '1.1',
        title: '로그인 화면 기획',
        description: 'OAuth2 로그인 플로우 정리',
        status: 'IN_PROGRESS' as const,
        sortOrder: 0,
        tags: [
          {
            tagId: 5,
            name: '긴급',
            color: 'RED',
          },
        ],
        assignees: [
          {
            userId: 91,
            nickname: '플로우민',
            email: 'flowmin@flowmeet.kr',
            profileImageUrl: 'https://cdn.flowmeet.kr/profile/91.png',
          },
        ],
        hasMeeting: false,
        childNodeIds: [],
        updatedAt: '2026-04-19T10:15:30',
      },
      {
        nodeId: 102,
        parentId: 100,
        number: '1.2',
        title: '로그인 API 구현',
        description: '백엔드 API 개발',
        status: 'TODO' as const,
        sortOrder: 1,
        tags: [],
        assignees: [
          {
            userId: 91,
            nickname: '플로우민',
            email: 'flowmin@flowmeet.kr',
            profileImageUrl: 'https://cdn.flowmeet.kr/profile/91.png',
          },
        ],
        hasMeeting: false,
        childNodeIds: [],
        updatedAt: '2026-04-19T10:15:30',
      },
      {
        nodeId: 200,
        parentId: null,
        number: '2',
        title: '대시보드 구현',
        description: '사용자 대시보드 UI/UX 개발',
        status: 'TODO' as const,
        sortOrder: 1,
        tags: [
          {
            tagId: 3,
            name: 'UI',
            color: 'BLUE',
          },
        ],
        assignees: [
          {
            userId: 91,
            nickname: '플로우민',
            email: 'flowmin@flowmeet.kr',
            profileImageUrl: 'https://cdn.flowmeet.kr/profile/91.png',
          },
        ],
        hasMeeting: false,
        childNodeIds: [],
        updatedAt: '2026-04-20T09:00:00',
      },
    ],
    edges: [
      {
        edgeId: 9001,
        startNodeId: 100,
        endNodeId: 200,
        createdBy: {
          userId: 91,
          nickname: '플로우민',
          email: 'flowmin@flowmeet.kr',
          profileImageUrl: 'https://cdn.flowmeet.kr/profile/91.png',
        },
        comment: '로그인 성공 시 대시보드로 이동',
      },
    ],
  },
};
