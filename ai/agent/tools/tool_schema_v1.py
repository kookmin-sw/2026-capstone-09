tool_schema = [
    {
        "name": "create_node",
        "description": "프로젝트에 새로운 노드를 생성합니다. parent_id 값에 따라 메인 노드 또는 서브 노드가 생성됩니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "노드를 생성할 프로젝트의 ID"},
                "title": {"type": "string", "description": "노드의 제목"},
                "description": {"type": "string", "description": "노드에 대한 상세 설명"},
                "type": {"type": "string", "enum": ["MAIN", "SUB"], "description": "노드 유형. MAIN은 최상위 노드, SUB는 하위 노드"},
                "parentId": {"type": "integer", "description": "상위 노드의 ID. 최상위 노드인 경우 생략"}
            },
            "required": ["projectId", "title", "type"],
            "additionalProperties": False
        }
    },
    {
        "name": "invite_member",
        "description": "프로젝트에 새로운 멤버를 이메일로 초대합니다. 초대받은 사용자의 이메일로 초대 링크가 포함된 메일이 전송됩니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "멤버를 초대할 프로젝트의 ID"},
                "email": {"type": "string", "format": "email", "description": "초대할 사용자의 이메일 주소"}
            },
            "required": ["projectId", "email"],
            "additionalProperties": False
        }
    },
    {
        "name": "remove_project_member",
        "description": "프로젝트에서 멤버를 삭제합니다. OWNER 권한을 가진 사용자만 실행할 수 있습니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "멤버를 삭제할 프로젝트의 ID"},
                "memberId": {"type": "integer", "description": "삭제할 멤버의 ID"}
            },
            "required": ["projectId", "memberId"],
            "additionalProperties": False
        }
    },
    {
        "name": "update_node_title",
        "description": "프로젝트 내 특정 노드의 제목을 수정합니다. 수정할 필드만 포함하면 됩니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "수정할 노드가 속한 프로젝트의 ID"},
                "nodeId": {"type": "integer", "description": "수정할 노드의 ID"},
                "title": {"type": "string", "description": "변경할 노드 제목"},
            },
            "required": ["projectId", "nodeId", "title"],
            "additionalProperties": False
        }
    },
    {
        "name": "update_node_description",
        "description": "프로젝트 내 특정 노드의 설명을 수정합니다. 수정할 필드만 포함하면 됩니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "수정할 노드가 속한 프로젝트의 ID"},
                "nodeId": {"type": "integer", "description": "수정할 노드의 ID"},
                "description": {"type": "string", "description": "변경할 노드 설명(마크다운 형식 지원)"},
            },
            "required": ["projectId", "nodeId", "description"],
            "additionalProperties": False
        }
    },
    {
        "name": "update_node_status",
        "description": "프로젝트 내 특정 노드의 상태를 수정합니다. 수정할 필드만 포함하면 됩니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "수정할 노드가 속한 프로젝트의 ID"},
                "nodeId": {"type": "integer", "description": "수정할 노드의 ID"},
                "status": {"type": "string", "enum": ["WAITING", "IN_PROGRESS", "DONE"], "description": "변경할 노드 진행 상태"}
            },
            "required": ["projectId", "nodeId", "status"],
            "additionalProperties": False
        }
    },
    {
        "name": "add_assignee",
        "description": "특정 노드에 담당자를 추가합니다. 담당자로 지정할 사용자는 해당 프로젝트의 멤버여야 합니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "담당자를 추가할 노드가 속한 프로젝트의 ID"},
                "nodeId": {"type": "integer", "description": "담당자를 추가할 노드의 ID"},
                "userId": {"type": "integer", "description": "담당자로 지정할 사용자의 ID"}
            },
            "required": ["projectId", "nodeId", "userId"],
            "additionalProperties": False
        }
    },
    {
        "name": "get_node",
        "description": "특정 노드의 상세 정보를 조회합니다. 노드의 제목, 설명, 진행 상태, 담당자, 태그, 연결된 회의 정보 등을 확인할 수 있습니다. 다른 tool 실행 전 nodeId가 필요할 때 활용하세요.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "조회할 노드가 속한 프로젝트의 ID"},
                "nodeId": {"type": "integer", "description": "조회할 노드의 ID"}
            },
            "required": ["projectId", "nodeId"],
            "additionalProperties": False
        }
    },
    {
        "name": "create_meeting",
        "description": "특정 노드에 회의를 생성하고 화상 회의 링크를 발급합니다. 참여자 ID 목록이 필요하므로 사용자 ID를 모를 경우 멤버 목록을 먼저 조회하세요.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "회의를 생성할 노드가 속한 프로젝트의 ID"},
                "nodeId": {"type": "integer", "description": "회의를 연결할 노드의 ID"},
                "startedAt": {"type": "string", "format": "date-time", "description": "회의 시작 시각 (ISO 8601 형식, 현재 시각 이후여야 함. 예: 2026-05-20T15:30:00)"},
                "participantUserIds": {"type": "array", "items": {"type": "integer"}, "description": "참여자 사용자 ID 목록 (1명 이상 필수)", "minItems": 1},
                "isPushEnabled": {"type": "boolean", "description": "회의 시작 전 푸시 알림 사용 여부"}
            },
            "required": ["projectId", "nodeId", "startedAt", "participantUserIds", "isPushEnabled"],
            "additionalProperties": False
        }
    },
    {
        "name": "create_edge",
        "description": "두 노드 사이에 연결선을 생성합니다. 플로우차트에서 노드 간의 흐름이나 관계를 표현할 때 사용합니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "연결선을 생성할 프로젝트의 ID"},
                "startNodeId": {"type": "integer", "description": "연결선의 시작 노드 ID"},
                "endNodeId": {"type": "integer", "description": "연결선의 종료 노드 ID"},
                "comment": {"type": "string", "description": "연결선에 대한 설명 (예: 로그인 성공 시 대시보드로 이동)"}
            },
            "required": ["projectId", "startNodeId", "endNodeId"],
            "additionalProperties": False
        }
    },
    {
        "name": "delete_edge",
        "description": "두 노드 사이의 연결선을 삭제합니다. edgeId를 모를 경우 플로우차트 조회를 통해 먼저 확인하세요.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "연결선이 속한 프로젝트의 ID"},
                "edgeId": {"type": "integer", "description": "삭제할 연결선의 ID"}
            },
            "required": ["projectId", "edgeId"],
            "additionalProperties": False
        }
    }
]