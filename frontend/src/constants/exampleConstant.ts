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

// TODO : 프로필 이미지 url 추가 + User 컴포넌트에 이미지 들어도록 수정 필요
export const EXAMPLE_USERS = [
  { userId: 1, nickname: '황수민', email: 'tnals655@kookmin.ac.kr' },
  { userId: 2, nickname: '박건민', email: 'parkkunmin@kookmin.ac.kr' },
  { userId: 3, nickname: '윤신지', email: 'shinji@kookmin.ac.kr' },
  { userId: 4, nickname: '백채린', email: 'chaerin@kookmin.ac.kr' },
  { userId: 5, nickname: '윤성욱', email: 'seonguk@kookmin.ac.kr' },
  { userId: 6, nickname: '박정은', email: 'jeongeun@kookmin.ac.kr' },
] as const;

export const EXAMPLE_MULTI_NODE_SUMMARY_NODES = [
  { id: 1, label: '비즈니스 모델 전략 회의' },
  { id: 2, label: 'MVP기능 회의' },
  { id: 3, label: 'MVP 개발 일정 조정 회의' },
  { id: 5, label: 'PPT 제작 회의' },
] as const;

export const EXAMPLE_MULTI_NODE_SUMMARY_RESULT = {
  // meeting_relationships: [
  //   {
  //     from: '비즈니스 모델 전략 회의',
  //     to: 'MVP기능 회의',
  //     relation: '구체화',
  //     reason:
  //       '비즈니스 모델 전략에서 결정된 학교 인터뷰 및 초기 UX 설계를 MVP 기능 회의에서 구체화함',
  //   },
  //   {
  //     from: 'MVP기능 회의',
  //     to: 'MVP 개발 일정 조정 회의',
  //     relation: '변화 발생',
  //     reason: '초기 MVP 기능 정의와 개발 일정이 일정 지연으로 인해 변경됨',
  //   },
  //   {
  //     from: '비즈니스 모델 전략 회의',
  //     to: 'PPT 제작 회의',
  //     relation: '시너지',
  //     reason: '수립된 비즈니스 모델 전략을 PT에 담아 대외 발표 자료로 활용함',
  //   },
  //   {
  //     from: 'MVP기능 회의',
  //     to: 'PPT 제작 회의',
  //     relation: '시너지',
  //     reason: '정의된 MVP 핵심 기능을 PT에 담아 대외 발표 자료로 활용함',
  //   },
  //   {
  //     from: 'MVP 개발 일정 조정 회의',
  //     to: 'PPT 제작 회의',
  //     relation: '선행조건',
  //     reason:
  //       'PT의 핵심 기능 파트는 조정된 MVP 기능으로 업데이트되어야 정확한 내용을 전달할 수 있음',
  //   },
  // ],
  // action_items_analysis: {
  //   total_count: 12,
  //   by_person: {
  //     정대학: { count: 3, rate: 0.25 },
  //     이학교: { count: 3, rate: 0.25 },
  //     박민대: { count: 4, rate: 0.33 },
  //     김국민: { count: 2, rate: 0.17 },
  //   },
  // },
  // development_ideas:
  //   '### 아이디어1: 비즈니스-개발 연동 강화\n전략과 MVP 구현 간의 피드백 루프를 강화하여 개발 현실성을 조기 반영.\n\n### 아이디어2: 통합 프로젝트 현황판 도입\n각 회의록의 결정 사항과 액션 아이템, 주요 이슈를 통합하여 공유.\n\n### 아이디어3: 비용 효율적 아키텍처 사전 검토\n초기 설계 단계부터 서버 비용 등 운영 비용을 고려한 아키텍처를 검토.',
  // mermaid_code:
  //   'graph TD\n    비즈니스모델전략회의["비즈니스 모델 전략 회의"] --- "구체화" --- MVP기능회의["MVP기능 회의"]\n    MVP기능회의["MVP기능 회의"] --- "변화 발생" --- MVP개발일정조정회의["MVP 개발 일정 조정 회의"]\n    비즈니스모델전략회의["비즈니스 모델 전략 회의"] --- "시너지" --- PPT제작회의["PPT 제작 회의"]\n    MVP기능회의["MVP기능 회의"] --- "시너지" --- PPT제작회의["PPT 제작 회의"]\n    MVP개발일정조정회의["MVP 개발 일정 조정 회의"] --- "선행조건" --- PPT제작회의["PPT 제작 회의"]',

  meetingRelationships: [
    {
      from: 'Yjs CRDT 통합 설계',
      to: '프레즌스 표시 UX 설계',
      relation: '시너지',
      reason:
        'Yjs CRDT는 동시 편집의 기반이 되며, 프레즌스 표시는 동시 편집 경험을 시각적으로 향상시킨다.',
    },
    {
      from: 'AI 답변 출처 표시',
      to: 'RAG 인덱싱 범위 확정',
      relation: '선행조건',
      reason:
        'AI 답변 출처 표시는 RAG 인덱싱 범위 확정을 통해 생성된 AI 답변의 신뢰도를 높이기 위한 후속 작업이다.',
    },
  ],
  actionItemsAnalysis: {
    totalCount: 3,
    byPerson: {
      신지: {
        count: 2,
        rate: 0.6666666666666666,
      },
      수민: {
        count: 1,
        rate: 0.3333333333333333,
      },
    },
  },
  developmentIdeas:
    '### 아이디어1: 실시간 협업 에디터\\nYjs CRDT 통합과 프레즌스 표시를 결합하여 사용자 친화적인 실시간 협업 에디터를 개발합니다.\\n\\n### 아이디어2: AI 답변 신뢰도 향상 시스템\\nRAG 인덱싱 범위 확정과 AI 답변 출처 표시를 연계하여 AI 답변의 신뢰도를 높이는 시스템을 구축합니다.\\n\\n### 아이디어3: 개인화된 지식 검색\\nRAG 인덱싱에서 비공개 노드 인덱스 분리를 활용하여 개인화된 검색 경험을 제공합니다.',
  mermaidCode:
    'graph TD\\n    YjsCRDT통합설계[\\"Yjs CRDT 통합 설계\\"] ---|\\"시너지\\"| 프레즌스표시UX설계[\\"프레즌스 표시 UX 설계\\"]\\n    AI답변출처표시[\\"AI 답변 출처 표시\\"] ---|\\"선행조건\\"| RAG인덱싱범위확정[\\"RAG 인덱싱 범위 확정\\"]',
} as const;

export const EXAMPLE_NODE_DETAIL = {
  nodeId: 101,
  projectId: 17,
  parentId: undefined,
  title: '로그인 화면 기획',
  description: 'OAuth2 로그인 플로우 정리',
  noteContent:
    '## 로그인 시나리오\n- Google OAuth ... 근데노드설명개길어지면어떡할거임?????????## 로그인 시나리오\n- Google OAuth ... 근데노드설명개길어지면어떡할거임?????????## 로그인 시나리오\n- Google OAuth ... 근데노드설명개길어지면어떡할거임?????????## 로그인 시나리오\n- Google OAuth ... 근데노드설명개길어지면어떡할거임?????????## 로그인 시나리오\n- Google OAuth ... 근데노드설명개길어지면어떡할거임?????????## 로그인 시나리오\n- Google OAuth ... 근데노드설명개길어지면어떡할거임?????????## 로그인 시나리오\n- Google OAuth ... 근데노드설명개길어지면어떡할거임?????????## 로그인 시나리오\n- Google OAuth ... 근데노드설명개길어지면어떡할거임?????????',
  status: 'WAITING',
  sortOrder: 1024,
  number: '1',
  tags: [
    {
      tagId: 5,
      name: '긴급',
      color: '#FF5A5F',
    },
    {
      tagId: 6,
      name: '긴급',
      color: '#FF5A5F',
    },
  ],
  assignees: [
    {
      userId: 91,
      nickname: '플로우민',
      email: 'flowmin@flowmeet.kr',
      profileImageUrl: undefined,
    },
    {
      userId: 92,
      nickname: '플로우민',
      email: 'flowmin@flowmeet.kr',
      profileImageUrl: 'https://cdn.flowmeet.kr/profile/91.png',
    },
  ],
  meeting: {
    meetingId: 57,
    status: 'SCHEDULED',
    startedAt: '2026-04-20T14:00:00',
    isPushEnabled: true,
    pushNotifyAt: '2026-04-20T13:50:00',
  },
  createdAt: '2026-03-01T09:00:00',
  updatedAt: '2026-04-19T10:15:30',
};

export const EXAMPLE_FLOWCHART_DATA = {
  nodes: [
    // 메인 노드 1
    {
      nodeId: 1,
      parentId: undefined,
      number: '1',
      title: '로그인 기능 개발',
      description: 'OAuth2 기반 로그인 시스템 구현',
      status: 'IN_PROGRESS' as const,
      sortOrder: 1024,
      tags: [
        { tagId: 1, name: 'Backend', color: 'BLUE' as const },
        { tagId: 2, name: 'Frontend', color: 'GREEN' as const },
      ],
      assignees: [
        { userId: 1, nickname: '김개발', email: 'dev@example.com', profileImageUrl: undefined },
      ],
      hasMeeting: false,
      childNodeIds: [11, 12],
      updatedAt: '2026-04-25T10:00:00',
    },
    // 서브 노드 1-1
    {
      nodeId: 11,
      parentId: 1,
      number: '1.1',
      title: 'Google OAuth 연동',
      description: undefined,
      status: 'DONE' as const,
      sortOrder: 2048,
      tags: [{ tagId: 1, name: 'Backend', color: 'BLUE' as const }],
      assignees: [
        { userId: 1, nickname: '김개발', email: 'dev@example.com', profileImageUrl: undefined },
      ],
      hasMeeting: false,
      childNodeIds: [],
      updatedAt: '2026-04-24T15:30:00',
    },
    // 서브 노드 1-2
    {
      nodeId: 12,
      parentId: 1,
      number: '1.2',
      title: '로그인 UI 구현',
      description: undefined,
      status: 'IN_PROGRESS' as const,
      sortOrder: 3072,
      tags: [{ tagId: 2, name: 'Frontend', color: 'GREEN' as const }],
      assignees: [
        {
          userId: 2,
          nickname: '박프론트',
          email: 'frontend@example.com',
          profileImageUrl: undefined,
        },
      ],
      hasMeeting: false,
      childNodeIds: [],
      updatedAt: '2026-04-25T09:15:00',
    },
    // 메인 노드 2
    {
      nodeId: 2,
      parentId: undefined,
      number: '2',
      title: '노드 플로우 시스템',
      description: 'React Flow 기반 노드 시각화 및 관리',
      status: 'IN_PROGRESS' as const,
      sortOrder: 4096,
      tags: [
        { tagId: 2, name: 'Frontend', color: 'GREEN' as const },
        { tagId: 3, name: 'Design', color: 'PURPLE' as const },
      ],
      assignees: [
        {
          userId: 2,
          nickname: '박프론트',
          email: 'frontend@example.com',
          profileImageUrl: undefined,
        },
        {
          userId: 3,
          nickname: '이디자인',
          email: 'design@example.com',
          profileImageUrl: undefined,
        },
      ],
      hasMeeting: true,
      childNodeIds: [21, 22, 23],
      updatedAt: '2026-04-25T11:20:00',
    },
    // 서브 노드 2-1
    {
      nodeId: 21,
      parentId: 2,
      number: '2.1',
      title: 'React Flow 마이그레이션',
      description: undefined,
      status: 'IN_PROGRESS' as const,
      sortOrder: 5120,
      tags: [{ tagId: 2, name: 'Frontend', color: 'GREEN' as const }],
      assignees: [
        {
          userId: 2,
          nickname: '박프론트',
          email: 'frontend@example.com',
          profileImageUrl: undefined,
        },
      ],
      hasMeeting: false,
      childNodeIds: [],
      updatedAt: '2026-04-25T11:00:00',
    },
    // 서브 노드 2-2
    {
      nodeId: 22,
      parentId: 2,
      number: '2.2',
      title: '커스텀 노드 스타일링',
      description: undefined,
      status: 'WAITING' as const,
      sortOrder: 6144,
      tags: [{ tagId: 3, name: 'Design', color: 'PURPLE' as const }],
      assignees: [
        {
          userId: 3,
          nickname: '이디자인',
          email: 'design@example.com',
          profileImageUrl: undefined,
        },
      ],
      hasMeeting: false,
      childNodeIds: [],
      updatedAt: '2026-04-24T16:00:00',
    },
    // 서브 노드 2-3
    {
      nodeId: 23,
      parentId: 2,
      number: '2.3',
      title: '성능 최적화',
      description: undefined,
      status: 'WAITING' as const,
      sortOrder: 7168,
      tags: [{ tagId: 2, name: 'Frontend', color: 'GREEN' as const }],
      assignees: [
        {
          userId: 2,
          nickname: '박프론트',
          email: 'frontend@example.com',
          profileImageUrl: undefined,
        },
      ],
      hasMeeting: false,
      childNodeIds: [],
      updatedAt: '2026-04-23T14:30:00',
    },
    // 메인 노드 3
    {
      nodeId: 3,
      parentId: undefined,
      number: '3',
      title: 'API 서버 구축',
      description: 'Spring Boot 기반 REST API 개발',
      status: 'WAITING' as const,
      sortOrder: 8192,
      tags: [
        { tagId: 1, name: 'Backend', color: 'BLUE' as const },
        { tagId: 4, name: 'Database', color: 'RED' as const },
      ],
      assignees: [
        { userId: 1, nickname: '김개발', email: 'dev@example.com', profileImageUrl: undefined },
      ],
      hasMeeting: false,
      childNodeIds: [31, 32],
      updatedAt: '2026-04-23T10:00:00',
    },
    // 서브 노드 3-1
    {
      nodeId: 31,
      parentId: 3,
      number: '3.1',
      title: 'DB 스키마 설계',
      description: undefined,
      status: 'WAITING' as const,
      sortOrder: 9216,
      tags: [{ tagId: 4, name: 'Database', color: 'RED' as const }],
      assignees: [
        { userId: 1, nickname: '김개발', email: 'dev@example.com', profileImageUrl: undefined },
      ],
      hasMeeting: false,
      childNodeIds: [],
      updatedAt: '2026-04-22T15:00:00',
    },
    // 서브 노드 3-2
    {
      nodeId: 32,
      parentId: 3,
      number: '3.2',
      title: 'RESTful API 엔드포인트',
      description: undefined,
      status: 'WAITING' as const,
      sortOrder: 10240,
      tags: [{ tagId: 1, name: 'Backend', color: 'BLUE' as const }],
      assignees: [
        { userId: 1, nickname: '김개발', email: 'dev@example.com', profileImageUrl: undefined },
      ],
      hasMeeting: false,
      childNodeIds: [],
      updatedAt: '2026-04-21T11:30:00',
    },
  ],
  edges: [
    // 참조 노드
    {
      edgeId: 1,
      startNodeId: 11,
      endNodeId: 21,
      createdBy: {
        userId: 1,
        nickname: '김개발',
        email: 'dev@example.com',
        profileImageUrl: 'https://via.placeholder.com/40',
      },
      comment: 'OAuth 토큰을 노드 플로우에서 사용',
    },
  ],
};
