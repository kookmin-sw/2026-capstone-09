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

export const EXAMPLE_PROJECT_SETTINGS = {
  projectName: '황수민의 비밀 공간❤️',
  memberCount: 10,
  createdAt: '2025.12.18.',
  nameMaxLength: 50,
} as const;

export const EXAMPLE_PROJECT_MEMBERS = [
  { id: 'member-1', name: '박건민', email: 'pkm021118@kookmin.ac.kr', role: 'member' },
  { id: 'member-2', name: '황수민', email: 'tnals655@kookmin.ac.kr', role: 'member' },
  { id: 'member-3', name: '윤신지', email: 'sinji1012@kookmin.ac.kr', role: 'admin' },
  { id: 'member-4', name: '백채린', email: 'chaerin@kookmin.ac.kr', role: 'member' },
  { id: 'member-5', name: '윤성욱', email: 'seonguk@kookmin.ac.kr', role: 'member' },
  { id: 'member-6', name: '박정은', email: 'jeongeun@kookmin.ac.kr', role: 'member' },
] as const;

export const EXAMPLE_PROJECT_NOTIFICATION_SETTINGS = {
  meetingEnabled: true,
  nodeEnabled: false,
  channels: {
    desktop: false,
    email: false,
  },
} as const;

export const EXAMPLE_SEARCH_RESULTS = {
  totalCount: 100,
  items: [
    {
      id: 'search-1',
      nodeNumber: '1',
      nodeType: 'main',
      title: '메인 노드 제목입니다.',
      lastEditDate: '2026.02.06.',
      summary:
        '노드 노트 요약 내용입니다. 대충 이런 느낌의 내용이 들어가있을 거에요. 몇 자까지 할까요? 맞춰보세요~ 딩동댕동 아 언제 다하냐글 자수를 더 채워야 하나',
    },
    {
      id: 'search-2',
      nodeNumber: '1.1',
      nodeType: 'sub',
      title: '디자인 회의일걸요',
      lastEditDate: '2026.02.06.',
      summary:
        '노드 노트 요약 내용입니다. 대충 이런 느낌의 내용이 들어가있을 거에요. 몇 자까지 할까요? 맞춰보세요~ 딩동댕동 아 언제 다하냐글 자수를 더 채워야 하나',
    },
    {
      id: 'search-3',
      nodeNumber: '1.2',
      nodeType: 'sub',
      title: '사용자 인터뷰 정리',
      lastEditDate: '2026.02.05.',
      summary:
        '인터뷰 주요 인사이트를 표로 정리했습니다. 주요 페인포인트와 반복된 요청사항 위주로 묶었어요. 우선순위 기준은 빈도와 임팩트 두 축입니다.',
    },
    {
      id: 'search-4',
      nodeNumber: '2',
      nodeType: 'main',
      title: '기능 스펙 v1 초안',
      lastEditDate: '2026.02.04.',
      summary:
        '기능별 요구사항과 인수 기준을 정리한 초안입니다. 이 문서는 리뷰가 끝나면 v2로 브랜치해서 업데이트할 예정이에요.',
    },
    {
      id: 'search-5',
      nodeNumber: '2.1',
      nodeType: 'sub',
      title: '온보딩 플로우 상세',
      lastEditDate: '2026.02.04.',
      summary:
        '신규 사용자 온보딩 3단계 플로우를 화면별로 쪼갠 상세 스펙입니다. 예외 케이스와 빈 상태도 함께 서술했습니다.',
    },
    {
      id: 'search-6',
      nodeNumber: '2.2',
      nodeType: 'sub',
      title: '권한 모델 정리',
      lastEditDate: '2026.02.03.',
      summary:
        '워크스페이스·프로젝트·노드 각 레벨에서의 권한 매트릭스를 정리했습니다. 초대·공유·역할 변경 흐름 포함.',
    },
    {
      id: 'search-7',
      nodeNumber: '3',
      nodeType: 'main',
      title: '프로토타입 피드백 모음',
      lastEditDate: '2026.02.02.',
      summary:
        '1차 프로토타입을 사용한 팀원과 테스터 8명의 피드백을 주제별로 분류했습니다. 긍정·개선 요청을 반반 섞어 정리.',
    },
    {
      id: 'search-8',
      nodeNumber: '3.1',
      nodeType: 'sub',
      title: '디자인 시스템 토큰 업데이트',
      lastEditDate: '2026.02.02.',
      summary:
        '색상·타이포·간격 토큰을 2025년 4분기 리브랜딩 가이드에 맞춰 업데이트합니다. 파이낸셜 컬러 추가 포함.',
    },
    {
      id: 'search-9',
      nodeNumber: '3.2',
      nodeType: 'sub',
      title: '접근성 체크리스트',
      lastEditDate: '2026.02.01.',
      summary:
        'WCAG 2.2 AA 기준을 기준으로 컴포넌트별 접근성 체크 리스트를 작성했습니다. 포커스 순서·명도비·키보드 조작 포함.',
    },
    {
      id: 'search-10',
      nodeNumber: '4',
      nodeType: 'main',
      title: '2월 스프린트 회고',
      lastEditDate: '2026.01.31.',
      summary:
        '이번 스프린트의 목표 달성도와 병목 요인을 정리했습니다. Keep-Problem-Try 프레임으로 팀 의견을 모았어요.',
    },
    {
      id: 'search-11',
      nodeNumber: '4.1',
      nodeType: 'sub',
      title: '리스크 관리 노트',
      lastEditDate: '2026.01.30.',
      summary:
        '식별된 리스크와 완화 전략, 책임자를 매핑한 보드. 다음 체크포인트는 2월 셋째 주로 잡혀 있습니다.',
    },
    {
      id: 'search-12',
      nodeNumber: '4.2',
      nodeType: 'sub',
      title: '문서 초안 공유 링크',
      lastEditDate: '2026.01.29.',
      summary:
        '외부 공유용 문서 링크를 정리했습니다. 열람 권한과 만료일을 함께 기재했고, 주별로 리프레시 예정입니다.',
    },
  ],
} as const;

export const EXAMPLE_USERS = [
  { name: '황수민', email: 'tnals655@kookmin.ac.kr' },
  { name: '박건민', email: 'parkkunmin@kookmin.ac.kr' },
  { name: '윤신지', email: 'shinji@kookmin.ac.kr' },
  { name: '백채린', email: 'chaerin@kookmin.ac.kr' },
  { name: '윤성욱', email: 'seonguk@kookmin.ac.kr' },
  { name: '박정은', email: 'jeongeun@kookmin.ac.kr' },
] as const;
