export const EXAMPLE_PROJECT_SIDEBAR_PROFILE = {
  projectName: '플로밋 기획',
  userName: '황수민',
  userEmail: 'tnals655@naver.com',
} as const;

export const EXAMPLE_SIDEBAR_ALARM_ITEMS = [
  {
    id: 'alarm-1',
    title: '프로젝트 일정 변경 알림',
    description:
        '진행 중이던 프로젝트의 일정이 변경되었습니다. 기존 마감일은 4월 20일이었으나 팀 내부 논의 결과 4월 23일로 연장되었습니다. 변경된 일정에 맞춰 작업 계획을 다시 확인해주시고, 필요한 경우 담당자와 협의 부탁드립니다.',
    timeText: '1시간 전',
    isUnread: true,
  },
  {
    id: 'alarm-2',
    title: '새로운 댓글이 등록되었습니다',
    description:
        '회원님이 작성한 게시글에 새로운 댓글이 등록되었습니다. 댓글 내용을 확인하고 필요한 경우 답변을 작성해 주세요. 커뮤니티 활동을 통해 더 많은 사용자와 소통할 수 있습니다.',
    timeText: '2시간 전',
    isUnread: true,
  },
  {
    id: 'alarm-3',
    title: '회의 일정 생성 안내',
    description:
        '팀 회의 일정이 새롭게 생성되었습니다. 회의는 4월 17일 오후 3시에 진행될 예정이며, 주요 안건은 프로젝트 진행 상황 공유 및 다음 스프린트 계획 수립입니다. 회의 전 관련 자료를 미리 확인해 주시기 바랍니다.',
    timeText: '3시간 전',
    isUnread: true,
  },
  {
    id: 'alarm-4',
    title: '파일 업로드 완료',
    description:
        '요청하신 파일 업로드가 정상적으로 완료되었습니다. 업로드된 파일은 프로젝트 상세 페이지에서 확인할 수 있으며, 팀원들과 공유 가능합니다. 문제가 있을 경우 다시 업로드를 진행해 주세요.',
    timeText: '5시간 전',
    isUnread: true,
  },
  {
    id: 'alarm-5',
    title: '권한 변경 안내',
    description:
        '회원님의 프로젝트 접근 권한이 변경되었습니다. 일부 기능에 대한 접근이 제한되거나 추가될 수 있으니, 현재 권한 상태를 확인해 주시기 바랍니다. 변경 사항에 대해 문의가 있을 경우 관리자에게 문의해 주세요.',
    timeText: '어제',
    isUnread: true,
  },
  {
    id: 'alarm-6',
    title: '시스템 점검 예정 공지',
    description:
        '서비스 안정화를 위한 시스템 점검이 예정되어 있습니다. 점검 시간은 4월 18일 오전 2시부터 오전 5시까지이며, 해당 시간 동안 일부 기능 사용이 제한될 수 있습니다. 이용에 참고 부탁드립니다.',
    timeText: '2일 전',
    isUnread: true,
  },
  {
    id: 'alarm-7',
    title: '새로운 팀원 초대',
    description:
        '프로젝트에 새로운 팀원이 초대되었습니다. 초대된 팀원의 역할과 담당 업무를 확인하시고, 필요한 경우 협업 도구를 통해 커뮤니케이션을 진행해 주시기 바랍니다.',
    timeText: '2일 전',
    isUnread: true,
  },
  {
    id: 'alarm-8',
    title: '작업 상태 변경 알림',
    description:
        '회원님이 담당하고 있는 작업의 상태가 변경되었습니다. 현재 상태는 “진행 중”으로 업데이트되었으며, 세부 내용은 작업 상세 페이지에서 확인할 수 있습니다.',
    timeText: '3일 전',
    isUnread: true,
  },
  {
    id: 'alarm-9',
    title: '멘션 알림',
    description:
        '댓글에서 회원님이 멘션되었습니다. 해당 댓글을 확인하여 필요한 조치를 취해 주시기 바랍니다. 빠른 응답은 원활한 협업에 도움이 됩니다.',
    timeText: '3일 전',
    isUnread: true,
  },
  {
    id: 'alarm-10',
    title: '프로젝트 생성 완료',
    description:
        '새로운 프로젝트가 성공적으로 생성되었습니다. 프로젝트 설정 및 초기 작업을 확인하고 팀원들과 공유하여 본격적인 작업을 시작해 주시기 바랍니다.',
    timeText: '4일 전',
    isUnread: true,
  },
  {
    id: 'alarm-11',
    title: '비밀번호 변경 안내',
    description:
        '회원님의 계정 비밀번호가 성공적으로 변경되었습니다. 본인이 요청하지 않은 변경이라면 즉시 고객센터에 문의하시고 계정 보안을 점검해 주시기 바랍니다.',
    timeText: '5일 전',
    isUnread: true,
  },
  {
    id: 'alarm-12',
    title: '이메일 인증 요청',
    description:
        '서비스 이용을 위해 이메일 인증이 필요합니다. 발송된 인증 메일을 확인하고 인증 절차를 완료해 주세요. 인증이 완료되지 않을 경우 일부 기능 사용이 제한될 수 있습니다.',
    timeText: '1주일 전',
    isUnread: true,
  },
] as const;