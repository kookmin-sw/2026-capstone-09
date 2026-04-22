export const EXAMPLE_PROJECT_SIDEBAR_PROFILE = {
  projectName: '플로밋 기획',
  userName: '황수민',
  userEmail: 'tnals655@naver.com',
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
  { name: '황수민', email: 'tnals655@kookmin.ac.kr' },
  { name: '박건민', email: 'parkkunmin@kookmin.ac.kr' },
  { name: '윤신지', email: 'shinji@kookmin.ac.kr' },
  { name: '백채린', email: 'chaerin@kookmin.ac.kr' },
  { name: '윤성욱', email: 'seonguk@kookmin.ac.kr' },
  { name: '박정은', email: 'jeongeun@kookmin.ac.kr' },
] as const;

export const EXAMPLE_NODE_DETAIL = {
  nodeId: 1,
  projectId: 1,
  parentId: null,
  title: '기획 문서 작성',
  description: '기획 초안 작성',
  noteContent: '# 기획 문서\\n\\n## 1. 서론\\n프로젝트 목적은...',
  status: 'IN_PROGRESS',
  sortOrder: 0,
  tags: [
    { tagId: 1, name: '긴급', color: '#FF0000' },
    { tagId: 3, name: '백엔드', color: '#0066FF' },
  ],
  assignees: [
    {
      userId: 10,
      nickname: '홍길동',
      email: 'hong@gmail.com',
      profileImageUrl: '<https://cdn.flowmit.com/profiles/10.png>',
    },
  ],
  meeting: {
    meetingId: 1,
    status: 'SCHEDULED',
    startedAt: '2026-03-27T15:30:00',
    pushEnabled: true,
    pushNotifyAt: '2026-03-27T15:00:00',
  },
  createdAt: '2026-03-25T09:00:00',
  updatedAt: '2026-03-26T10:00:00',
};
